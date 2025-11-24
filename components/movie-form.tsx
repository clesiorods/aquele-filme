"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Switch } from "@heroui/switch";
import StarRating from "./star-rating";

interface Movie {
  id?: number;
  title: string;
  synopsis: string | null;
  coverImage: string | null;
  comments: string | null;
  rating: number;
  duration: number | null;
  watched: boolean;
}

interface MovieFormProps {
  movie?: Movie | null;
  onSuccess?: () => void;
}

export default function MovieForm({ movie, onSuccess }: MovieFormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Movie>({
    title: movie?.title || "",
    synopsis: movie?.synopsis || "",
    coverImage: movie?.coverImage || "",
    comments: movie?.comments || "",
    rating: movie?.rating || 0,
    duration: movie?.duration || null,
    watched: movie?.watched ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = movie?.id ? `/api/movies/${movie.id}` : "/api/movies";
      const method = movie?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
        if (onSuccess) onSuccess();
        // Reset form
        setFormData({
          title: "",
          synopsis: "",
          coverImage: "",
          comments: "",
          rating: 0,
          duration: null,
          watched: true,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar filme:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        onPress={onOpen}
        className="font-semibold"
      >
        {movie ? "Editar Filme" : "+ Adicionar Filme"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">
                {movie ? "Editar Filme" : "Adicionar Novo Filme"}
              </h2>
            </ModalHeader>
            <ModalBody className="gap-4">
              <Input
                label="Título do Filme"
                placeholder="Ex: O Poderoso Chefão"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                isRequired
                isDisabled={loading}
              />

              <Input
                label="URL da Capa"
                placeholder="https://exemplo.com/capa.jpg"
                value={formData.coverImage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                isDisabled={loading}
                description="Cole a URL da imagem de capa do filme"
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
                description="Duração do filme em minutos"
              />

              <Textarea
                label="Sinopse"
                placeholder="Descreva a história do filme..."
                value={formData.synopsis || ""}
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
                value={formData.comments || ""}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                isDisabled={loading}
                minRows={2}
              />

              <Switch
                isSelected={formData.watched}
                onValueChange={(watched) =>
                  setFormData({ ...formData, watched })
                }
                isDisabled={loading}
              >
                Já assisti este filme
              </Switch>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={loading}
              >
                {movie ? "Atualizar" : "Adicionar"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

