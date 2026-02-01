import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { Attachment } from './attachment.entity';
import { Expense } from './expense.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private repo: Repository<Client>,
    @InjectRepository(Attachment) private attachmentRepo: Repository<Attachment>,
    @InjectRepository(Expense) private expenseRepo: Repository<Expense>,
  ) {}

  async findByCnpj(cnpj: string): Promise<Client | null> {
    if (!cnpj) return null;
    const normalized = cnpj.replace(/\D/g, '');
    return this.repo.findOne({ where: { cnpj: normalized } });
  }

  // helper to create sample client (optional)
  async createIfNotExists(payload: Partial<Client>) {
    const normalized = (payload.cnpj || '').replace(/\D/g, '');
    let c = await this.repo.findOne({ where: { cnpj: normalized } });
    if (!c) {
      c = this.repo.create({ ...payload, cnpj: normalized });
      await this.repo.save(c);
    }
    return c;
  }

  async saveAttachment(clientId: string, data: Partial<Attachment>, uploadedById?: string) {
    const attachment = this.attachmentRepo.create({ ...data });
    // link client by id only to avoid extra query
    (attachment as any).client = { id: clientId };
    if (uploadedById) {
      (attachment as any).uploadedBy = { id: uploadedById };
    }
    return this.attachmentRepo.save(attachment);
  }

  async getAttachmentsByClientId(clientId: string) {
    return this.attachmentRepo.find({ where: { client: { id: clientId } }, order: { createdAt: 'DESC' } });
  }

  async getAttachmentById(id: string) {
    return this.attachmentRepo.findOne({ where: { id } });
  }

  async getExpensesSummaryByCategory(
    clientId: string,
    period?: 'monthly' | 'quarterly',
    month?: string,
    quarter?: string,
  ) {
    let query = this.expenseRepo
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.clientId = :clientId', { clientId });

    // Aplicar filtros de período se fornecidos
    if (period === 'monthly' && month) {
      // month formato: YYYY-MM
      const [year, monthNum] = month.split('-');
      const startDate = new Date(`${year}-${monthNum}-01`);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
      
      query = query.andWhere('expense.date >= :startDate', { startDate })
        .andWhere('expense.date <= :endDate', { endDate });
    } else if (period === 'quarterly' && quarter) {
      // quarter formato: YYYY-Q1, YYYY-Q2, etc
      const [year, q] = quarter.split('-');
      const quarterNum = parseInt(q.replace('Q', ''));
      const startMonth = (quarterNum - 1) * 3 + 1;
      const endMonth = quarterNum * 3;
      
      const startDate = new Date(`${year}-${String(startMonth).padStart(2, '0')}-01`);
      const endDate = new Date(parseInt(year), endMonth, 0, 23, 59, 59);
      
      query = query.andWhere('expense.date >= :startDate', { startDate })
        .andWhere('expense.date <= :endDate', { endDate });
    }

    const expenses = await query
      .groupBy('expense.category')
      .orderBy('total', 'DESC')
      .getRawMany();

    return expenses.map(e => ({ category: e.category, total: parseFloat(e.total) }));
  }

  async processSpreadsheet(filePath: string, clientId: string): Promise<{ success: boolean; count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      // Ler o arquivo Excel ou CSV
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!data || data.length === 0) {
        return { success: false, count: 0, errors: ['Planilha vazia ou formato inválido'] };
      }

      // Buscar o cliente
      const client = await this.repo.findOne({ where: { id: clientId } });
      if (!client) {
        return { success: false, count: 0, errors: ['Cliente não encontrado'] };
      }

      // Processar cada linha da planilha
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Aceitar diferentes nomes de colunas (case-insensitive)
          const categoria = row.categoria || row.Categoria || row.CATEGORIA || row.category || row.Category || 
                           row['Categoria de Gasto'] || row['categoria de gasto'] || row['CATEGORIA DE GASTO'];
          
          const descricao = row.descricao || row.Descricao || row.DESCRICAO || row.description || row.Description || 
                           row.descrição || row.Descrição || row['Descrição'] || row['descrição'];
          
          const valor = row.valor || row.Valor || row.VALOR || row.amount || row.Amount || row.price || 
                       row.Preço || row.preço || row['Valor (R$)'] || row['valor (r$)'] || row['VALOR (R$)'] ||
                       row['Valor'] || row['valor'];
          
          const data_str = row.data || row.Data || row.DATA || row.date || row.Date;
          
          const tipo = row.tipo || row.Tipo || row.TIPO || row.type || row.Type || 
                      row.natureza || row.Natureza || row.NATUREZA || row['Tipo de Movimentação'] || 
                      row['tipo de movimentação'] || row['TIPO DE MOVIMENTAÇÃO'] || 'SAIDA'; // Default

          if (!categoria || valor === undefined || valor === null) {
            errors.push(`Linha ${i + 2}: categoria e valor são obrigatórios`);
            continue;
          }

          // Converter valor para número
          let amount = 0;
          if (typeof valor === 'number') {
            amount = valor;
          } else if (typeof valor === 'string') {
            // Remover "R$", espaços e outros caracteres
            let cleanValue = valor.trim();
            cleanValue = cleanValue.replace(/R\$\s*/g, ''); // Remove R$
            cleanValue = cleanValue.replace(/\s/g, ''); // Remove espaços
            
            // Se tem ponto e vírgula, assumir formato BR: 1.000,00
            if (cleanValue.includes('.') && cleanValue.includes(',')) {
              cleanValue = cleanValue.replace(/\./g, ''); // Remove pontos (milhares)
              cleanValue = cleanValue.replace(',', '.'); // Vírgula vira ponto decimal
            } else if (cleanValue.includes(',')) {
              // Só vírgula, assumir decimal BR: 1000,00
              cleanValue = cleanValue.replace(',', '.');
            }
            
            amount = parseFloat(cleanValue);
          }

          if (isNaN(amount) || amount <= 0) {
            errors.push(`Linha ${i + 2}: valor inválido (${valor})`);
            continue;
          }

          // Processar data
          let expenseDate = new Date();
          if (data_str) {
            // Tentar diferentes formatos de data
            let parsed: Date;
            
            // Se for string no formato DD/MM
            if (typeof data_str === 'string' && data_str.includes('/')) {
              const parts = data_str.split('/');
              if (parts.length === 2) {
                // Formato DD/MM (assumir ano atual)
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1; // Mês começa em 0
                const year = new Date().getFullYear();
                parsed = new Date(year, month, day);
              } else if (parts.length === 3) {
                // Formato DD/MM/YYYY
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                parsed = new Date(year, month, day);
              } else {
                parsed = new Date(data_str);
              }
            } else {
              parsed = new Date(data_str);
            }
            
            if (!isNaN(parsed.getTime())) {
              expenseDate = parsed;
            }
          }

          // Normalizar tipo
          let expenseType = 'SAIDA'; // Default
          if (tipo) {
            const tipoNormalized = String(tipo).toUpperCase().trim();
            if (tipoNormalized.includes('ENTRADA') || tipoNormalized.includes('RECEITA') || 
                tipoNormalized.includes('CREDITO') || tipoNormalized.includes('ENTRADA') ||
                tipoNormalized === 'E' || tipoNormalized === 'ENTRADA' || tipoNormalized === 'IN') {
              expenseType = 'ENTRADA';
            } else if (tipoNormalized.includes('SAIDA') || tipoNormalized.includes('DESPESA') || 
                      tipoNormalized.includes('DEBITO') || tipoNormalized.includes('GASTO') ||
                      tipoNormalized === 'S' || tipoNormalized === 'SAIDA' || tipoNormalized === 'OUT') {
              expenseType = 'SAIDA';
            }
          }

          // Criar a despesa
          const expense = this.expenseRepo.create({
            category: String(categoria).trim(),
            description: descricao ? String(descricao).trim() : '',
            amount: amount,
            type: expenseType,
            date: expenseDate,
          });
          expense.client = client;
          await this.expenseRepo.save(expense);
          count++;
        } catch (err) {
          errors.push(`Linha ${i + 2}: ${err.message}`);
        }
      }

      return { success: count > 0, count, errors };
    } catch (err) {
      return { success: false, count: 0, errors: [err.message || 'Erro ao processar planilha'] };
    }
  }

  async updateExpense(expenseId: string, updates: any) {
    const expense = await this.expenseRepo.findOne({ where: { id: expenseId } });
    if (!expense) return null;

    if (updates.category) expense.category = updates.category;
    if (updates.description) expense.description = updates.description;
    if (updates.amount !== undefined) expense.amount = parseFloat(updates.amount);
    if (updates.type) expense.type = updates.type;
    if (updates.date) expense.date = new Date(updates.date);

    return this.expenseRepo.save(expense);
  }

  async deleteExpense(expenseId: string) {
    const expense = await this.expenseRepo.findOne({ where: { id: expenseId } });
    if (!expense) return false;

    await this.expenseRepo.remove(expense);
    return true;
  }

  async getExpensesByClientId(clientId: string) {
    return this.expenseRepo.find({
      where: { client: { id: clientId } },
      order: { date: 'DESC' },
    });
  }
}

