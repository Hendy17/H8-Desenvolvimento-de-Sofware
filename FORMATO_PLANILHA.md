# Formato da Planilha de Despesas

Para que o sistema processe automaticamente suas planilhas de despesas, siga este formato:

## Formatos Aceitos
- **Excel**: `.xlsx` ou `.xls`
- **CSV**: `.csv`

## Colunas Obrigatórias

A planilha deve conter as seguintes colunas (aceita diferentes nomes):

| Coluna | Nomes Aceitos | Obrigatório | Exemplo |
|--------|--------------|-------------|---------|
| **Categoria** | categoria, Categoria, CATEGORIA, category, Category | ✅ Sim | Salários |
| **Valor** | valor, Valor, VALOR, amount, Amount, price, Preço, preço | ✅ Sim | 45000 ou R$ 45.000,00 |
| **Descrição** | descricao, Descricao, DESCRICAO, description, Description, descrição, Descrição | ❌ Não | Folha de pagamento |
| **Data** | data, Data, DATA, date, Date | ❌ Não | 2024-01-15 |

## Exemplo de Planilha Excel

```
| categoria   | descricao                    | valor      | data       |
|-------------|------------------------------|------------|------------|
| Salários    | Folha de pagamento mensal    | 45000.00   | 2024-01-15 |
| Aluguel     | Aluguel do escritório        | 8500.00    | 2024-01-05 |
| Impostos    | INSS e FGTS                  | 12000.00   | 2024-01-20 |
| Fornecedores| Compra de materiais          | 18500.00   | 2024-01-10 |
| Energia     | Conta de luz                 | 3200.00    | 2024-01-08 |
```

## Observações

### Formato de Valores
O sistema aceita valores em diferentes formatos:
- `45000` ou `45000.00` (formato numérico)
- `R$ 45.000,00` ou `45.000,00` (com separadores)
- `45,000.00` (formato internacional)

### Formato de Datas
- `2024-01-15` (ISO)
- `15/01/2024` (BR)
- Se não informada, usa a data atual

### Categorias Sugeridas
- Salários
- Aluguel
- Impostos
- Fornecedores
- Energia
- Internet
- Telefonia
- Marketing
- Manutenção
- Transporte
- Combustível
- Material de Escritório

## Como Usar

1. Crie sua planilha no Excel ou Google Sheets
2. Salve como `.xlsx` ou `.xls`
3. Na página do cliente, clique em "Anexar Planilhas"
4. Selecione sua planilha
5. Clique em "Enviar"
6. O sistema processará automaticamente e mostrará quantas despesas foram adicionadas
7. A página recarregará automaticamente para mostrar os novos dados no gráfico

## Exemplo de Planilha Pronta

Você pode usar o cliente de teste (CNPJ: 00000000000191) que já possui dados exemplo.
