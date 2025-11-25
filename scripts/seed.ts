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

    // Verificar se o usuário de demonstração já existe
    const existingDemo = await userRepository.findOne({
      where: { email: "demonstracao@demonstracao.com" },
    });

    if (!existingDemo) {
      // Criar usuário de demonstração
      const hashedDemoPassword = await hashPassword("demonstracao@123");
      const demoUser = userRepository.create({
        email: "demonstracao@demonstracao.com",
        password: hashedDemoPassword,
        name: "Usuário Demonstração",
        isAdmin: false,
      });

      await userRepository.save(demoUser);
      console.log("✅ Usuário de demonstração criado com sucesso!");
      console.log("   Email: demonstracao@demonstracao.com");
      console.log("   Senha: demonstracao@123");
    } else {
      console.log("ℹ️  Usuário de demonstração já existe. Pulando criação.");
    }

    await dataSource.destroy();
    console.log("\n🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  }
}

seed();

