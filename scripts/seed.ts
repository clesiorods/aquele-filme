import "reflect-metadata";
import { config } from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
config();

import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { hashPassword } from "@/lib/auth";

async function seed() {
  try {
    console.log("Iniciando seed...");
    
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Verificar se o usuário admin já existe
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@admin.com" },
    });

    if (existingAdmin) {
      console.log("Usuário admin já existe. Pulando criação.");
      await dataSource.destroy();
      return;
    }

    // Criar usuário admin
    const hashedPassword = await hashPassword("admin");
    const adminUser = userRepository.create({
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Administrador",
    });

    await userRepository.save(adminUser);
    console.log("Usuário admin criado com sucesso!");
    console.log("Email: admin@admin.com");
    console.log("Senha: admin");

    await dataSource.destroy();
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  }
}

seed();

