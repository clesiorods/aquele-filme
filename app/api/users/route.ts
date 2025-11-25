import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { getCurrentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";

// GET - Listar todos os usuários (apenas para admin/autenticado)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const users = await userRepository.find({
      select: ["id", "email", "name", "createdAt", "updatedAt"],
      order: { createdAt: "DESC" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao listar usuários" },
      { status: 500 },
    );
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, senha e nome são obrigatórios" },
        { status: 400 },
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 4 caracteres" },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Verificar se o usuário já existe
    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 },
      );
    }

    // Criar novo usuário
    const hashedPassword = await hashPassword(password);
    const newUser = userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    await userRepository.save(newUser);

    return NextResponse.json(
      { 
        message: "Usuário criado com sucesso", 
        user: { 
          id: newUser.id, 
          email: newUser.email, 
          name: newUser.name,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        } 
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 },
    );
  }
}

