import { Controller, Get, Query, NotFoundException, Post, Body, BadRequestException, UseInterceptors, UploadedFile, Param, Res, Req, Put, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { ClientsService } from './clients.service';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

class CreateClientDto {
  cnpj: string;
  name: string;
  address?: string;
}

class UpdateExpenseDto {
  category?: string;
  description?: string;
  amount?: number;
  date?: string;
}

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService, private authService: AuthService) {}

  @Get('search')
  async search(@Query('cnpj') cnpj: string) {
    const client = await this.clientsService.findByCnpj(cnpj);
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return client;
  }

  @Post()
  async create(@Body() payload: CreateClientDto) {
    if (!payload || !payload.cnpj || !payload.name) {
      throw new BadRequestException('cadastrar requires cnpj and name');
    }
    const created = await this.clientsService.createIfNotExists({
      cnpj: payload.cnpj,
      name: payload.name,
      address: payload.address,
    });
    return created;
  }

  @Post('attachments/:cnpj')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          try {
            if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
          } catch (err) {
            cb(err as any, uploadPath);
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadAttachment(@Param('cnpj') cnpj: string, @UploadedFile() file: any, @Req() req: Request) {
    if (!cnpj) throw new BadRequestException('cnpj is required in path');
    const client = await this.clientsService.findByCnpj(cnpj);
    if (!client) throw new NotFoundException('Cliente não encontrado para anexar');
    if (!file) throw new BadRequestException('File is required');
    // try to identify uploader from cookie token
    let uploadedById: string | undefined = undefined;
    const token = (req as any).cookies?.token as string | undefined;
    if (token) {
      const payload: any = this.authService.verifyToken(token);
      if (payload && payload.sub) {
        uploadedById = payload.sub;
      }
    }

    // persist metadata (including uploadedBy when available)
    const saved = await this.clientsService.saveAttachment(client.id, {
      filename: file.filename,
      originalname: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      path: file.path,
    } as any, uploadedById);

    // Processar planilha automaticamente se for Excel ou CSV
    const ext = file.originalname.toLowerCase();
    if (ext.endsWith('.xlsx') || ext.endsWith('.xls') || ext.endsWith('.csv')) {
      const result = await this.clientsService.processSpreadsheet(file.path, client.id);
      return {
        message: 'File uploaded and processed',
        attachment: saved,
        processed: result.success,
        expensesAdded: result.count,
        errors: result.errors,
      };
    }

    return { message: 'File uploaded', attachment: saved };
  }

  @Get(':cnpj/attachments')
  async listAttachments(@Param('cnpj') cnpj: string) {
    const client = await this.clientsService.findByCnpj(cnpj);
    if (!client) throw new NotFoundException('Cliente não encontrado');
    const attachments = await this.clientsService.getAttachmentsByClientId(client.id);
    return attachments;
  }

  @Get('attachments/:id/download')
  async downloadAttachment(@Param('id') id: string, @Res() res: any) {
    const attachment = await this.clientsService.getAttachmentById(id);
    if (!attachment) throw new NotFoundException('Attachment not found');
    const filePath = attachment.path;
    if (!filePath || !fs.existsSync(filePath)) throw new NotFoundException('File not found on disk');
    const stream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', attachment.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalname}"`);
    stream.pipe(res);
  }

  @Get(':cnpj/expenses/summary')
  async getExpensesSummary(
    @Param('cnpj') cnpj: string,
    @Query('period') period?: 'monthly' | 'quarterly',
    @Query('month') month?: string,
    @Query('quarter') quarter?: string,
  ) {
    const client = await this.clientsService.findByCnpj(cnpj);
    if (!client) throw new NotFoundException('Cliente não encontrado');
    
    const summary = await this.clientsService.getExpensesSummaryByCategory(
      client.id,
      period,
      month,
      quarter
    );
    
    return { client: { id: client.id, name: client.name, cnpj: client.cnpj }, expenses: summary };
  }

  @Get(':cnpj/expenses')
  async getExpenses(@Param('cnpj') cnpj: string) {
    const client = await this.clientsService.findByCnpj(cnpj);
    if (!client) throw new NotFoundException('Cliente não encontrado');
    const expenses = await this.clientsService.getExpensesByClientId(client.id);
    return { client: { id: client.id, name: client.name, cnpj: client.cnpj }, expenses };
  }

  @Put('expenses/:expenseId')
  async updateExpense(@Param('expenseId') expenseId: string, @Body() dto: UpdateExpenseDto) {
    if (!expenseId) throw new BadRequestException('expenseId is required');
    
    const updated = await this.clientsService.updateExpense(expenseId, dto);
    if (!updated) throw new NotFoundException('Despesa não encontrada');
    
    return { message: 'Despesa atualizada com sucesso', expense: updated };
  }

  @Delete('expenses/:expenseId')
  async deleteExpense(@Param('expenseId') expenseId: string) {
    if (!expenseId) throw new BadRequestException('expenseId is required');
    
    const deleted = await this.clientsService.deleteExpense(expenseId);
    if (!deleted) throw new NotFoundException('Despesa não encontrada');
    
    return { message: 'Despesa deletada com sucesso' };
  }
}

