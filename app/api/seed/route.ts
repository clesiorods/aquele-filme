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

    // Verificar se o usuário admin já existe
    const existingAdmin = await userRepository.findOne({
      where: { email: "admin@admin.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Usuário admin já existe",
        user: {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: existingAdmin.name,
        },
      });
    }

    // Criar usuário admin
    const hashedPassword = await hashPassword("admin");
    const adminUser = userRepository.create({
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Administrador",
    });

    await userRepository.save(adminUser);

    return NextResponse.json({
      message: "Usuário admin criado com sucesso!",
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
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

