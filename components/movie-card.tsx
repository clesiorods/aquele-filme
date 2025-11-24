"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import StarRating from "./star-rating";
import { useState, useEffect } from "react";
import styles from "./movie-card.module.css";

interface Movie {
  id: number;
  title: string;
  synopsis: string | null;
  coverImage: string | null;
  comments: string | null;
  rating: number;
  duration: number | null;
  watched: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MovieCardProps {
  movie: Movie;
  onUpdate?: () => void;
  onDelete?: (id: number) => void;
}

export default function MovieCard({ movie, onUpdate, onDelete }: MovieCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [formData, setFormData] = useState({
    title: movie.title,
    synopsis: movie.synopsis || "",
    coverImage: movie.coverImage || "",
    comments: movie.comments || "",
    rating: movie.rating,
    duration: movie.duration || null,
    watched: movie.watched,
  });

  useEffect(() => {
    if (isOpen && !isEditing) {
      // Reset form data when opening modal in view mode
      setFormData({
        title: movie.title,
        synopsis: movie.synopsis || "",
        coverImage: movie.coverImage || "",
        comments: movie.comments || "",
        rating: movie.rating,
        duration: movie.duration || null,
        watched: movie.watched,
      });
    }
  }, [movie, isOpen, isEditing]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar este filme?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: "DELETE",
      });

      if (response.ok && onDelete) {
        onDelete(movie.id);
        onClose();
      }
    } catch (error) {
      console.error("Erro ao deletar filme:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/movies/${movie.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Erro ao atualizar filme:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original movie data
    setFormData({
      title: movie.title,
      synopsis: movie.synopsis || "",
      coverImage: movie.coverImage || "",
      comments: movie.comments || "",
      rating: movie.rating,
      duration: movie.duration || null,
      watched: movie.watched,
    });
  };

  const defaultImage = "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Sem+Capa";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * 7; // Parte onde o mouse passa fica mais alta
    const rotateY = ((x - centerX) / centerX) * -7;
    
    setTiltStyle({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0 });
    setIsFlipped(false);
  };

  return (
    <>
      <div 
        className={`w-full h-full ${styles.flipContainer}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`${styles.flipInner} ${isFlipped ? styles.flipped : ""}`}
          style={{
            transform: isFlipped 
              ? `rotateY(180deg) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`
              : `rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`,
          }}
        >
          {/* Frente do Card */}
          <div className={styles.flipFront}>
            <Card className="w-full h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="relative w-full h-64 overflow-hidden rounded-t-lg bg-default-100">
                  <img
                    src={movie.coverImage || defaultImage}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <Chip
                      color={movie.watched ? "success" : "warning"}
                      variant="flat"
                      size="sm"
                      className="shadow-md"
                    >
                      {movie.watched ? "Já vi" : "Quero ver"}
                    </Chip>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-4">
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{movie.title}</h3>
                {movie.duration && (
                  <p className="text-xs text-default-500 mb-2">
                    ⏱️ {movie.duration} minutos
                  </p>
                )}
                {movie.synopsis && (
                  <p 
                    className="text-sm text-default-600 mb-3 line-clamp-3 cursor-pointer hover:text-gray-400 transition-colors"
                    onClick={() => setIsFlipped(!isFlipped)}
                    title="Clique para ver sinopse completa"
                  >
                    {movie.synopsis}
                  </p>
                )}
                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={movie.rating} readonly size="sm" />
                </div>
                {movie.comments && (
                  <p className="text-xs text-default-500 line-clamp-2 italic">
                    "{movie.comments}"
                  </p>
                )}
              </CardBody>
              <CardFooter className="pt-0 px-4 pb-4 gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={onOpen}
                  className="flex-1"
                >
                  Ver Detalhes
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={handleDelete}
                  isLoading={isDeleting}
                >
                  Deletar
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Verso do Card */}
          <div className={styles.flipBack}>
            <Card className="w-full h-full relative overflow-hidden flex flex-col">
              <div
                className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${movie.coverImage || defaultImage})`,
                }}
              />
              <div className="relative z-10 h-full flex flex-col p-6 bg-background/80 backdrop-blur-sm">
                <div className="mb-4">
                  <Chip
                    color={movie.watched ? "success" : "warning"}
                    variant="flat"
                    className="mb-3"
                  >
                    {movie.watched ? "Já assisti" : "Quero assistir"}
                  </Chip>
                  <h3 className="text-2xl font-bold mb-4">{movie.title}</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {movie.synopsis ? (
                    <div>
                      <h4 className="text-sm font-semibold text-default-500 mb-2 uppercase tracking-wide">
                        Sinopse
                      </h4>
                      <p className="text-base text-default-700 leading-relaxed">
                        {movie.synopsis}
                      </p>
                    </div>
                  ) : (
                    <p className="text-default-500 italic">
                      Nenhuma sinopse disponível
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-default-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-default-500 mb-1">Avaliação</p>
                      <StarRating rating={movie.rating} readonly size="md" />
                    </div>
                    {movie.comments && (
                      <div className="flex-1 ml-4 pl-4 border-l border-default-200">
                        <p className="text-xs text-default-500 mb-1">Comentário</p>
                        <p className="text-sm text-default-600 italic line-clamp-2">
                          "{movie.comments}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {isEditing ? (
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Título do filme"
                isRequired
                isDisabled={loading}
                className="text-2xl font-bold"
              />
            ) : (
              <h2 className="text-2xl font-bold">{movie.title}</h2>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                {isEditing ? (
                  <div className="space-y-2">
                    <Image
                      src={formData.coverImage || defaultImage}
                      alt={formData.title}
                      className="w-full md:w-48 h-64 md:h-72 object-cover rounded-lg"
                    />
                    <Input
                      label="URL da Capa"
                      placeholder="https://exemplo.com/capa.jpg"
                      value={formData.coverImage}
                      onChange={(e) =>
                        setFormData({ ...formData, coverImage: e.target.value })
                      }
                      isDisabled={loading}
                      size="sm"
                    />
                    <Input
                      type="number"
                      label="Duração (minutos)"
                      placeholder="Ex: 120"
                      value={formData.duration?.toString() || ""}
                      onChange={(e) =>
                        setFormData({ 
                          ...formData, 
                          duration: e.target.value ? parseInt(e.target.value) : null 
                        })
                      }
                      isDisabled={loading}
                      size="sm"
                    />
                  </div>
                ) : (
                  <Image
                    src={movie.coverImage || defaultImage}
                    alt={movie.title}
                    className="w-full md:w-48 h-64 md:h-72 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <>
                    <Switch
                      isSelected={formData.watched}
                      onValueChange={(watched) =>
                        setFormData({ ...formData, watched })
                      }
                      isDisabled={loading}
                    >
                      Já assisti este filme
                    </Switch>
                    <Textarea
                      label="Sinopse"
                      placeholder="Descreva a história do filme..."
                      value={formData.synopsis}
                      onChange={(e) =>
                        setFormData({ ...formData, synopsis: e.target.value })
                      }
                      isDisabled={loading}
                      minRows={3}
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Avaliação
                      </label>
                      <StarRating
                        rating={formData.rating}
                        onRatingChange={(rating) =>
                          setFormData({ ...formData, rating })
                        }
                        size="lg"
                      />
                    </div>
                    <Textarea
                      label="Comentários"
                      placeholder="O que você achou do filme? (opcional)"
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData({ ...formData, comments: e.target.value })
                      }
                      isDisabled={loading}
                      minRows={2}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <Chip
                        color={movie.watched ? "success" : "warning"}
                        variant="flat"
                        className="mb-2"
                      >
                        {movie.watched ? "Já assisti" : "Quero assistir"}
                      </Chip>
                    </div>
                    {movie.synopsis && (
                      <div>
                        <h4 className="font-semibold mb-2">Sinopse</h4>
                        <p className="text-default-600">{movie.synopsis}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">Avaliação</h4>
                      <StarRating rating={movie.rating} readonly size="lg" />
                    </div>
                    {movie.comments && (
                      <div>
                        <h4 className="font-semibold mb-2">Comentários</h4>
                        <p className="text-default-600 italic">{movie.comments}</p>
                      </div>
                    )}
                    <div className="text-xs text-default-400">
                      Adicionado em {new Date(movie.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {isEditing ? (
              <>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCancel}
                  isDisabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={loading}
                >
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleDelete}
                  isLoading={isDeleting}
                >
                  Deletar
                </Button>
                <Button
                  color="secondary"
                  variant="flat"
                  onPress={() => setIsEditing(true)}
                >
                  Editar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Fechar
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

