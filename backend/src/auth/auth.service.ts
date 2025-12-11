import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'pg';
import { TenantMeta } from '../tenants/tenant.entity';
import { CreateTenantMeta1701640000000 } from '../migrations/0001-CreateTenantMeta';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
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

    // generate tenant database name
    const dbName = `accounting_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Parse DATABASE_URL if available, otherwise use individual vars
    let dbConfig: any;
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL);
      dbConfig = {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // remove leading /
      };
    } else {
      dbConfig = {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT || 5432),
        user: process.env.POSTGRES_USER || 'account',
        password: process.env.POSTGRES_PASSWORD || 'accountpass',
        database: process.env.POSTGRES_DB || process.env.DB || 'accounting',
      };
    }

    // create database using pg client
    const client = new Client(dbConfig);

    await client.connect();

    // quick check: does the DB user have CREATEDB privilege?
    const dbUser = process.env.POSTGRES_USER || 'account';
    try {
      const check = await client.query('SELECT rolcreatedb FROM pg_roles WHERE rolname = $1', [dbUser]);
      if (check.rows.length && check.rows[0].rolcreatedb === false) {
        await client.end();
        throw new ForbiddenException(`DB user "${dbUser}" lacks CREATEDB privilege. Grant it with: ALTER ROLE ${dbUser} CREATEDB`);
      }
    } catch (checkErr) {
      // if the check itself fails for some reason, proceed and let the create DATABASE call handle errors
    }
    let createdBySuper = false;
    try {
      // CREATE DATABASE cannot run inside transaction block
      await client.query(`CREATE DATABASE "${dbName}"`);
    } catch (err: any) {
      // if database exists, ignore
      if (err.code === '42P04') {
        // already exists, continue
      } else {
        // if we have superuser credentials, try fallback: create DB as superuser and assign owner to app user
        const superUser = process.env.POSTGRES_SUPERUSER;
        const superPass = process.env.POSTGRES_SUPERPASSWORD;
        if (superUser && superPass) {
          const superDbConfig = { ...dbConfig, user: superUser, password: superPass };
          const superClient = new Client(superDbConfig);
          try {
            await superClient.connect();
            await superClient.query(`CREATE DATABASE "${dbName}" OWNER "${dbUser}"`);
            createdBySuper = true;
          } catch (superErr: any) {
            await superClient.end().catch(() => {});
            await client.end().catch(() => {});
            throw new InternalServerErrorException('Erro ao criar database do tenant');
          }
          await superClient.end().catch(() => {});
        } else {
          await client.end();
          throw new InternalServerErrorException('Erro ao criar database do tenant');
        }
      }
    }

    // initialize tenant schema using TypeORM DataSource so migrations/synchronize can run
    // Initialize tenant DB schema via migrations (safer for production)
    const tenantDataSource = new DataSource({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbName,
      // we don't set entities for schema sync here; migrations will create required tables
      migrations: [CreateTenantMeta1701640000000],
      synchronize: false,
    });

    try {
      await tenantDataSource.initialize();
      // run pending migrations on tenant DB
      await tenantDataSource.runMigrations({ transaction: 'all' });
      await tenantDataSource.destroy();
    } catch (initErr: any) {
      // log detailed error for debugging
      // eslint-disable-next-line no-console
      console.error('Tenant initialization error:', initErr);
      // attempt cleanup: drop the database if initialization fails
      try {
        await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
      } catch (dropErr) {
        await client.end().catch(() => {});
        throw initErr;
      }
      await client.end();
      throw initErr;
    }

    await client.end();

    const user = this.usersRepo.create({ email, password: hashed, role: 'user', tenantDbName: dbName });
    await this.usersRepo.save(user);

    // return minimal info (no password)
    return { id: user.id, email: user.email, tenantDbName: user.tenantDbName };
  }
}
