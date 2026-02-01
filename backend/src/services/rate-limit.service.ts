import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';

interface RateLimit {
  count: number;
  resetTime: number;
  blocked: boolean;
}

interface SystemMetrics {
  activeConnections: number;
  pendingQueries: number;
  memoryUsage: number;
  cpuUsage: number;
  lastCheck: Date;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private clientLimits: Map<string, RateLimit> = new Map();
  
  // Limites por empresa
  private readonly LIMITS = {
    REQUESTS_PER_MINUTE: 100,      // 100 requests por minuto
    EXCEL_UPLOADS_PER_HOUR: 10,    // 10 planilhas por hora
    MAX_FILE_SIZE_MB: 10,          // 10MB max por arquivo
    MAX_ROWS_PER_FILE: 10000,      // 10k linhas max por planilha
  };

  /**
   * Verificar se cliente pode fazer request
   */
  canMakeRequest(clientId: string): boolean {
    const now = Date.now();
    const limit = this.clientLimits.get(clientId);
    
    if (!limit || now > limit.resetTime) {
      // Resetar contador a cada minuto
      this.clientLimits.set(clientId, {
        count: 1,
        resetTime: now + 60000, // 1 minuto
        blocked: false,
      });
      return true;
    }
    
    if (limit.count >= this.LIMITS.REQUESTS_PER_MINUTE) {
      limit.blocked = true;
      this.logger.warn(`🚫 Rate limit atingido para cliente ${clientId}`);
      return false;
    }
    
    limit.count++;
    return true;
  }

  /**
   * Verificar se pode fazer upload de Excel
   */
  canUploadExcel(clientId: string, fileSize: number): { allowed: boolean; reason?: string } {
    // Verificar tamanho do arquivo
    if (fileSize > this.LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024) {
      return { 
        allowed: false, 
        reason: `Arquivo muito grande. Máximo: ${this.LIMITS.MAX_FILE_SIZE_MB}MB` 
      };
    }

    // Verificar rate limit de uploads
    const uploads = this.getClientUploads(clientId);
    if (uploads >= this.LIMITS.EXCEL_UPLOADS_PER_HOUR) {
      return { 
        allowed: false, 
        reason: `Limite de uploads atingido. Máximo: ${this.LIMITS.EXCEL_UPLOADS_PER_HOUR} por hora` 
      };
    }

    return { allowed: true };
  }

  /**
   * Monitorar saúde do sistema
   */
  async getSystemHealth(): Promise<SystemMetrics> {
    const metrics: SystemMetrics = {
      activeConnections: await this.getActiveConnections(),
      pendingQueries: await this.getPendingQueries(),
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      cpuUsage: process.cpuUsage().system / 1000000, // %
      lastCheck: new Date(),
    };

    // Log alerta se sistema estiver sobrecarregado
    if (metrics.activeConnections > 40) {
      this.logger.warn(`⚠️ Alto número de conexões: ${metrics.activeConnections}`);
    }
    
    if (metrics.memoryUsage > 500) {
      this.logger.warn(`⚠️ Alto uso de memória: ${metrics.memoryUsage.toFixed(2)}MB`);
    }

    return metrics;
  }

  private getClientUploads(clientId: string): number {
    // Implementar contagem de uploads na última hora
    // Por enquanto retorna 0
    return 0;
  }

  private async getActiveConnections(): Promise<number> {
    // Implementar query para contar conexões ativas
    return 0;
  }

  private async getPendingQueries(): Promise<number> {
    // Implementar contagem de queries pendentes
    return 0;
  }
}

/**
 * Middleware de rate limiting
 */
export function rateLimitMiddleware() {
  return (req: Request, res: any, next: any) => {
    // Implementar middleware de rate limiting
    // Extrair clientId do token JWT
    // Verificar limites
    // Bloquear se necessário
    next();
  };
}