import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { Movie } from "@/entities/Movie";
import { getCurrentUser } from "@/lib/auth";

// GET - Buscar filme específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const dataSource = await getDataSource();
    const movieRepository = dataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: parseInt(params.id), userId: user.id },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Filme não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ movie });
  } catch (error) {
    console.error("Erro ao buscar filme:", error);
    return NextResponse.json(
      { error: "Erro ao buscar filme" },
      { status: 500 },
    );
  }
}

// PUT - Atualizar filme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const dataSource = await getDataSource();
    const movieRepository = dataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: parseInt(params.id), userId: user.id },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Filme não encontrado" },
        { status: 404 },
      );
    }

    if (title) movie.title = title;
    if (synopsis !== undefined) movie.synopsis = synopsis;
    if (coverImage !== undefined) movie.coverImage = coverImage;
    if (comments !== undefined) movie.comments = comments;
    if (rating !== undefined) movie.rating = rating;
    if (duration !== undefined) movie.duration = duration;
    if (watched !== undefined) movie.watched = watched;

    await movieRepository.save(movie);

    return NextResponse.json({
      message: "Filme atualizado com sucesso",
      movie,
    });
  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar filme" },
      { status: 500 },
    );
  }
}

// DELETE - Deletar filme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 },
      );
    }

    const dataSource = await getDataSource();
    const movieRepository = dataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: parseInt(params.id), userId: user.id },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Filme não encontrado" },
        { status: 404 },
      );
    }

    await movieRepository.remove(movie);

    return NextResponse.json({ message: "Filme deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar filme:", error);
    return NextResponse.json(
      { error: "Erro ao deletar filme" },
      { status: 500 },
    );
  }
}

