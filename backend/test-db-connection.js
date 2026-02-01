#!/usr/bin/env node

// Script para testar conexão com PostgreSQL no Render
const { Client } = require('pg');

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.log('❌ DATABASE_URL não encontrada');
    console.log('ℹ️  Para testar localmente: export DATABASE_URL="sua_url_postgres"');
    process.exit(1);
  }

  console.log('🔍 Testando conexão PostgreSQL...');
  console.log('🔗 URL format:', dbUrl.substring(0, 30) + '...');
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('🔌 Conectando...');
    await client.connect();
    
    console.log('✅ Conexão estabelecida!');
    
    // Teste simples
    const result = await client.query('SELECT NOW() as current_time');
    console.log('🕐 Horário do servidor:', result.rows[0].current_time);
    
    // Informações da conexão
    const versionResult = await client.query('SELECT version()');
    console.log('🗄️  PostgreSQL:', versionResult.rows[0].version.split(' ')[1]);
    
    await client.end();
    console.log('✅ Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao conectar:');
    console.error('- Código:', error.code);
    console.error('- Mensagem:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('ℹ️  Verifique se o hostname do banco está correto');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('ℹ️  Verifique se o PostgreSQL está rodando na porta especificada');
    } else if (error.message.includes('SSL')) {
      console.log('ℹ️  Problema com SSL - verifique a configuração SSL do banco');
    }
    
    process.exit(1);
  }
}

testConnection();