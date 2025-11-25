// Carregar variáveis de ambiente ANTES de qualquer importação
import { config } from "dotenv";
config();

import "reflect-metadata";
import { AppDataSource } from "../data-source";

async function revertMigration() {
  try {
    console.log("Inicializando conexão com o banco de dados...");
    await AppDataSource.initialize();
    
    console.log("Revertendo última migration...");
    await AppDataSource.undoLastMigration();
    
    console.log("Migration revertida com sucesso!");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Erro ao reverter migration:", error);
    process.exit(1);
  }
}

revertMigration();

