# Funcionalidade de Filtro de Período - Página do Cliente

## Descrição
Foi adicionada uma nova funcionalidade à página do cliente que permite buscar e filtrar relatórios de despesas por período:
- **Todos os Períodos**: Exibe todas as despesas registradas
- **Relatório Mensal**: Permite selecionar um mês específico para visualizar despesas daquele período
- **Relatório Trimestral**: Permite selecionar um trimestre específico para visualizar despesas daquele período

## Arquivos Modificados

### 1. `/frontend/types/cliente/types.ts`
- Adicionado novo tipo `PeriodType` para definir os tipos de períodos suportados

### 2. `/frontend/hooks/cliente/useClienteDashboard.ts`
- Adicionados estados para gerenciar:
  - `periodType`: Tipo de período selecionado
  - `selectedMonth`: Mês selecionado (formato: YYYY-MM)
  - `selectedQuarter`: Trimestre selecionado (formato: YYYY-Q#)
- Refatorizado o carregamento de dados para a função `fetchExpensesData`
- Adicionados handlers para mudanças de período:
  - `handlePeriodChange`
  - `handleMonthChange`
  - `handleQuarterChange`

### 3. `/frontend/pages/cliente/[cnpj].tsx`
- Importado o novo componente `PeriodFilter`
- Adicionado a renderização do componente de filtro entre o cabeçalho e as estatísticas

### 4. `/frontend/components/period-filter/` (Novo Componente)
- **index.tsx**: Componente React para renderizar os filtros de período
  - Interface `PeriodFilterProps` para type-safety
  - Opções de meses (Janeiro a Dezembro)
  - Opções de trimestres (Q1 a Q4)
  - Seleção condicional de dropdowns baseado no período escolhido
  
- **styles.module.css**: Estilos para o componente
  - Estilo para o cartão de filtro
  - Estilos para título e container de seleção

## Como Funciona

1. **Seleção de Período**: O usuário clica em um dos três botões (Todos os Períodos, Relatório Mensal ou Relatório Trimestral)

2. **Seleção de Detalhe**: 
   - Para **Mensal**: Um dropdown aparece para selecionar o mês
   - Para **Trimestral**: Um dropdown aparece para selecionar o trimestre
   - Para **Todos**: Nenhum dropdown adicional é necessário

3. **Carregamento de Dados**: Quando o período é alterado, a função `fetchExpensesData` é chamada automaticamente com os parâmetros apropriados:
   - URL base: `/clients/{cnpj}/expenses/summary`
   - Parâmetros opcionais:
     - `?period=monthly&month=YYYY-MM`
     - `?period=quarterly&quarter=YYYY-Q#`

4. **Atualização Visual**: Os dados do dashboard (total de despesas, maior categoria, gráfico de pizza) são atualizados automaticamente

## Próximas Etapas (Backend)

Para que a funcionalidade funcione completamente, o backend precisa:

1. Atualizar o endpoint `GET /clients/{cnpj}/expenses/summary` para aceitar parâmetros de filtro:
   ```typescript
   @Query('period') period?: 'monthly' | 'quarterly'
   @Query('month') month?: string // Formato: YYYY-MM
   @Query('quarter') quarter?: string // Formato: YYYY-Q1, YYYY-Q2, etc
   ```

2. Filtrar as despesas baseado nos parâmetros fornecidos

3. Retornar os dados agregados do período específico

## Exemplos de Requisições

```bash
# Todas as despesas
GET /clients/00000000000191/expenses/summary

# Despesas de janeiro de 2025
GET /clients/00000000000191/expenses/summary?period=monthly&month=2025-01

# Despesas do 1º trimestre de 2025
GET /clients/00000000000191/expenses/summary?period=quarterly&quarter=2025-Q1
```

## Manutenção das Funcionalidades Existentes

✅ Botão "Anexar Planilhas" - Mantido
✅ Botão "Voltar" - Mantido
✅ Estatísticas (Total de Despesas, Maior Categoria) - Mantido
✅ Gráfico de Despesas por Categoria - Mantido
✅ Modal de Upload - Mantido
✅ Todos os estados e handlers de upload - Mantidos
