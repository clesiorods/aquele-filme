# Migrations

Este diretório contém as migrations do TypeORM para gerenciar a estrutura do banco de dados MySQL.

## Estrutura das Migrations

- `1700000000000-CreateUsers.ts` - Cria a tabela `users`
- `1700000000001-CreateMovies.ts` - Cria a tabela `movies` com relacionamento com `users`

## Comandos Disponíveis

### Executar todas as migrations pendentes
```bash
npm run migration:run
```

### Reverter a última migration
```bash
npm run migration:revert
```

## Notas

- As migrations são executadas na ordem dos timestamps (números no início do nome do arquivo)
- A tabela `users` deve ser criada antes da tabela `movies` devido ao relacionamento de chave estrangeira
- Certifique-se de que as variáveis de ambiente no arquivo `.env` estão configuradas corretamente antes de executar as migrations

