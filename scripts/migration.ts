// Carregar variáveis de ambiente ANTES de qualquer importação
import { config } from "dotenv";
config();

import "reflect-metadata";
import { AppDataSource } from "../data-source";

async function runMigrations() {
  try {
    // Verificar se as variáveis de ambiente foram carregadas
    console.log("Variáveis de ambiente:");
    console.log(`DB_HOST: ${process.env.DB_HOST || "Não definido"} ${process.env.DB_HOST ? "✓" : "✗"}`);
    console.log(`DB_USER: ${process.env.DB_USER || "Não definido"} ${process.env.DB_USER ? "✓" : "✗"}`);
    console.log(`DB_NAME: ${process.env.DB_NAME || "Não definido"} ${process.env.DB_NAME ? "✓" : "✗"}`);
    console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD || "Não definido"} ${process.env.DB_PASSWORD ? "✓" : "✗"}`);
    
    console.log("\nInicializando conexão com o banco de dados...");
    await AppDataSource.initialize();
    
    console.log("Executando migrations...");
    await AppDataSource.runMigrations();
    
    console.log("Migrations executadas com sucesso!");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Erro ao executar migrations:", error);
    process.exit(1);
  }
}

runMigrations();

