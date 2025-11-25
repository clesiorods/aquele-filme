import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { hashPassword } from "@/lib/auth";

export async function POST() {
  try {
    // Apenas em desenvolvimento
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Seed não disponível em produção" },
        { status: 403 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Verificar se o usuário de demonstração já existe
    const existingDemo = await userRepository.findOne({
      where: { email: "demonstracao@demonstracao.com" },
    });

    if (existingDemo) {
      return NextResponse.json({
        message: "Usuário de demonstração já existe",
        user: {
          id: existingDemo.id,
          email: existingDemo.email,
          name: existingDemo.name,
        },
      });
    }

    // Criar usuário de demonstração
    const hashedPassword = await hashPassword("demonstracao@123");
    const demoUser = userRepository.create({
      email: "demonstracao@demonstracao.com",
      password: hashedPassword,
      name: "Usuário Demonstração",
      isAdmin: false,
    });

    await userRepository.save(demoUser);

    return NextResponse.json({
      message: "Usuário de demonstração criado com sucesso!",
      user: {
        id: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
      },
    });
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário admin" },
      { status: 500 },
    );
  }
}

