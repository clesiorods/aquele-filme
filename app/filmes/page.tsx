"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { title, subtitle } from "@/components/primitives";
import MovieCard from "@/components/movie-card";
import MovieForm from "@/components/movie-form";

interface Movie {
  id: number;
  title: string;
  synopsis: string | null;
  coverImage: string | null;
  comments: string | null;
  rating: number;
  watched: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FilmesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "watched" | "want">("all");

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchTerm, filter]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const watchedParam = filter === "watched" ? "true" : filter === "want" ? "false" : null;
      const url = watchedParam ? `/api/movies?watched=${watchedParam}` : "/api/movies";
      
      const response = await fetch(url);
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setMovies(data.movies || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = [...movies];

    // Filtrar por watched/want
    if (filter === "watched") {
      filtered = filtered.filter((m) => m.watched);
    } else if (filter === "want") {
      filtered = filtered.filter((m) => !m.watched);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(term) ||
          m.synopsis?.toLowerCase().includes(term) ||
          m.comments?.toLowerCase().includes(term)
      );
    }

    setFilteredMovies(filtered);
  };

  const handleMovieAdded = () => {
    fetchMovies();
  };

  const handleMovieDeleted = (id: number) => {
    setMovies(movies.filter((m) => m.id !== id));
  };

  const watchedCount = movies.filter((m) => m.watched).length;
  const wantCount = movies.filter((m) => !m.watched).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={title()}>Meus Filmes</h1>
          <p className={subtitle({ class: "mt-2" })}>
            Gerencie sua coleção de filmes assistidos e desejados
          </p>
        </div>
        <MovieForm onSuccess={handleMovieAdded} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Total</p>
              <p className="text-2xl font-bold">{movies.length}</p>
            </div>
            <div className="text-3xl">🎬</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Já assisti</p>
              <p className="text-2xl font-bold text-success">{watchedCount}</p>
            </div>
            <div className="text-3xl">✅</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Quero ver</p>
              <p className="text-2xl font-bold text-warning">{wantCount}</p>
            </div>
            <div className="text-3xl">📝</div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar filmes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
          startContent={
            <svg
              className="w-5 h-5 text-default-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
        />
        <Tabs
          selectedKey={filter}
          onSelectionChange={(key) => setFilter(key as typeof filter)}
          variant="underlined"
        >
          <Tab key="all" title={`Todos (${movies.length})`} />
          <Tab key="watched" title={`Já vi (${watchedCount})`} />
          <Tab key="want" title={`Quero ver (${wantCount})`} />
        </Tabs>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredMovies.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm
                ? "Nenhum filme encontrado"
                : "Nenhum filme cadastrado ainda"}
            </h3>
            <p className="text-default-500 text-center mb-4">
              {searchTerm
                ? "Tente buscar com outros termos"
                : "Comece adicionando seu primeiro filme!"}
            </p>
            {!searchTerm && <MovieForm onSuccess={handleMovieAdded} />}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onUpdate={handleMovieAdded}
              onDelete={handleMovieDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}

