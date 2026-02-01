#!/bin/bash

# Script de deploy para Render
echo "🚀 Iniciando deploy do backend..."

# Navegar para o diretório do backend
cd backend

echo "📦 Instalando dependências..."
npm install

echo "🔨 Compilando TypeScript..."
npm run build

echo "✅ Build concluído!"