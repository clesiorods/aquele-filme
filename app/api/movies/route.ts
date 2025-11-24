import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Movie } from "@/entities/Movie";
import { getCurrentUser } from "@/lib/auth";

// GET - Listar filmes do usuário
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const watched = searchParams.get("watched");

    const dataSource = await getDataSource();
    const movieRepository = dataSource.getRepository(Movie);

    const where: any = { userId: user.id };
    if (watched !== null) {
      where.watched = watched === "true";
    }

    const movies = await movieRepository.find({
      where,
      order: { createdAt: "DESC" },
    });

    return NextResponse.json({ movies });
  } catch (error) {
    console.error("Erro ao listar filmes:", error);
    return NextResponse.json(
      { error: "Erro ao listar filmes" },
      { status: 500 },
    );
  }
}

// POST - Criar novo filme
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const { title, synopsis, coverImage, comments, rating, duration, watched } =
      await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Título é obrigatório" },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const movieRepository = dataSource.getRepository(Movie);

    const movie = movieRepository.create({
      title,
      synopsis: synopsis || null,
      coverImage: coverImage || null,
      comments: comments || null,
      rating: rating || 0,
      duration: duration || null,
      watched: watched ?? true,
      userId: user.id,
    });

    await movieRepository.save(movie);

    return NextResponse.json(
      { message: "Filme criado com sucesso", movie },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar filme:", error);
    return NextResponse.json(
      { error: "Erro ao criar filme" },
      { status: 500 },
    );
  }
}

