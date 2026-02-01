import { BadRequestException, Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersRepo.findOne({ where: { email } });
      if (!user) return null;

      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  async findUserById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async register(email: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Usuário já existe');
    }

    const hashed = await bcrypt.hash(password, 10);

    // Generate tenant database name for multi-tenant isolation
    const dbName = `accounting_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    console.log('🔍 Creating user with tenant database:', dbName);

    try {
      const newUser = this.usersRepo.create({
        email,
        password: hashed,
        name: email.split('@')[0], // Use email prefix as default name
        role: 'user',
        tenantDbName: dbName,
      });

      const saved = await this.usersRepo.save(newUser);
      console.log('✅ User created successfully:', saved.id);
      
      // Return minimal info (no password)
      return { id: saved.id, email: saved.email, tenantDbName: saved.tenantDbName };
      
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw new BadRequestException('Erro ao criar usuário: ' + error.message);
    }
  }

  async sendCredentialsByEmail(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email não encontrado');
    }

    // Simular envio de email - aqui você pode integrar com um serviço real de email
    console.log('📧 Enviando credenciais por email para:', email);
    console.log('📧 Credenciais:', { email: user.email, senha: 'senha enviada por email' });
    
    return { success: true };
  }
}