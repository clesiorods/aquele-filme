import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { getCurrentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";

// GET - Obter um usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const foundUser = await userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "name", "createdAt", "updatedAt"],
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user: foundUser });
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return NextResponse.json(
      { error: "Erro ao obter usuário" },
      { status: 500 },
    );
  }
}

// PUT - Atualizar um usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 },
      );
    }

    const { email, password, name } = await request.json();

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const foundUser = await userRepository.findOne({
      where: { id: userId },
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Atualizar campos
    if (email !== undefined) {
      // Verificar se o email já está em uso por outro usuário
      const existingUser = await userRepository.findOne({
        where: { email },
      });
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json(
          { error: "Este email já está em uso" },
          { status: 400 },
        );
      }
      foundUser.email = email;
    }

    if (name !== undefined) {
      foundUser.name = name;
    }

    if (password !== undefined) {
      if (password.length < 4) {
        return NextResponse.json(
          { error: "A senha deve ter pelo menos 4 caracteres" },
          { status: 400 },
        );
      }
      foundUser.password = await hashPassword(password);
    }

    await userRepository.save(foundUser);

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 },
    );
  }
}

// DELETE - Deletar um usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 },
      );
    }

    // Não permitir deletar a si mesmo
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Você não pode deletar sua própria conta" },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const foundUser = await userRepository.findOne({
      where: { id: userId },
    });

    if (!foundUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    await userRepository.remove(foundUser);

    return NextResponse.json({
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao deletar usuário" },
      { status: 500 },
    );
  }
}

