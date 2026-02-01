import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../clients/expense.entity';
import { Client } from '../clients/client.entity';
import * as XLSX from 'xlsx';

interface ProcessingJob {
  id: string;
  clientId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  errorMessage?: string;
  createdAt: Date;
}

@Injectable()
export class ExcelProcessorService {
  private readonly logger = new Logger(ExcelProcessorService.name);
  private processingQueue: Map<string, ProcessingJob> = new Map();
  private readonly MAX_CONCURRENT_JOBS = 3; // Máximo 3 processamentos simultâneos
  private readonly MAX_ROWS_PER_BATCH = 100; // Processar 100 linhas por vez
  private activeJobs = 0;

  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
  ) {}

  /**
   * Adiciona planilha à fila de processamento
   */
  async queueExcelProcessing(
    clientId: string, 
    fileName: string, 
    fileBuffer: Buffer
  ): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Análise rápida do arquivo para contar linhas
    const workbook = XLSX.read(fileBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    const job: ProcessingJob = {
      id: jobId,
      clientId,
      fileName,
      status: 'pending',
      progress: 0,
      totalRows: data.length,
      processedRows: 0,
      createdAt: new Date(),
    };

    this.processingQueue.set(jobId, job);
    this.logger.log(`📋 Planilha adicionada à fila: ${fileName} (${data.length} linhas)`);

    // Iniciar processamento se houver slot disponível
    this.processNext();
    
    return jobId;
  }

  /**
   * Processar próximo job da fila
   */
  private async processNext() {
    if (this.activeJobs >= this.MAX_CONCURRENT_JOBS) {
      this.logger.log(`⏳ Limite de jobs simultâneos atingido (${this.activeJobs}/${this.MAX_CONCURRENT_JOBS})`);
      return;
    }

    const pendingJob = Array.from(this.processingQueue.values())
      .find(job => job.status === 'pending');

    if (!pendingJob) {
      return;
    }

    this.activeJobs++;
    pendingJob.status = 'processing';
    
    try {
      await this.processExcelFile(pendingJob);
      pendingJob.status = 'completed';
      pendingJob.progress = 100;
      this.logger.log(`✅ Processamento concluído: ${pendingJob.fileName}`);
    } catch (error) {
      pendingJob.status = 'failed';
      pendingJob.errorMessage = error.message;
      this.logger.error(`❌ Erro no processamento: ${pendingJob.fileName}`, error);
    } finally {
      this.activeJobs--;
      // Processar próximo job
      setTimeout(() => this.processNext(), 100);
    }
  }

  /**
   * Processar arquivo Excel em lotes
   */
  private async processExcelFile(job: ProcessingJob) {
    this.logger.log(`🔄 Iniciando processamento: ${job.fileName}`);
    
    // Simular processamento em lotes para não sobrecarregar o banco
    for (let i = 0; i < job.totalRows; i += this.MAX_ROWS_PER_BATCH) {
      const endIndex = Math.min(i + this.MAX_ROWS_PER_BATCH, job.totalRows);
      
      // Processar lote atual
      await this.processBatch(job, i, endIndex);
      
      // Atualizar progresso
      job.processedRows = endIndex;
      job.progress = Math.round((endIndex / job.totalRows) * 100);
      
      this.logger.log(`📊 Progresso ${job.fileName}: ${job.progress}% (${endIndex}/${job.totalRows})`);
      
      // Pausa pequena entre lotes para não sobrecarregar
      await this.sleep(50);
    }
  }

  /**
   * Processar um lote de linhas
   */
  private async processBatch(job: ProcessingJob, startIndex: number, endIndex: number) {
    // Implementar lógica de inserção no banco em lotes
    // Usar transação para garantir consistência
    // Implementar retry em caso de erro temporário
    this.logger.log(`📦 Processando lote ${startIndex}-${endIndex} para ${job.fileName}`);
  }

  /**
   * Obter status de processamento
   */
  getJobStatus(jobId: string): ProcessingJob | null {
    return this.processingQueue.get(jobId) || null;
  }

  /**
   * Listar todos os jobs de um cliente
   */
  getClientJobs(clientId: string): ProcessingJob[] {
    return Array.from(this.processingQueue.values())
      .filter(job => job.clientId === clientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Limpar jobs antigos (>24h)
   */
  cleanupOldJobs() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let cleaned = 0;
    
    for (const [jobId, job] of this.processingQueue.entries()) {
      if (job.createdAt < cutoff && job.status !== 'processing') {
        this.processingQueue.delete(jobId);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      this.logger.log(`🧹 Limpeza: ${cleaned} jobs antigos removidos`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}