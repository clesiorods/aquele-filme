"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { title } from "@/components/primitives";
import { EyeIcon, EyeSlashIcon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao processar requisição");
        setLoading(false);
        return;
      }

      // Redirecionar para dashboard após login/registro bem-sucedido
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-8">
      
      <h1 className="text-2xl font-bold">AQUELE FILME</h1>

      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center pt-6">
          <h1 className={title({ size: "md" })}>
            {isLogin ? "Entrar" : "Criar Conta"}
          </h1>
        </CardHeader>
        <CardBody className="gap-4 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <Input
                label="Nome"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                isDisabled={loading}
              />
            )}
            <Input
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              isDisabled={loading}
            />
            <Input
              type={isPasswordVisible ? "text" : "password"}
              label="Senha"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              isDisabled={loading}
              minLength={4}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeSlashIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            {error && (
              <div className="text-danger text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>
          <div className="text-center text-sm">
            {isLogin ? (
              <>
                Não tem uma conta?{" "}
                <Link
                  href="#"
                  onPress={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className="text-primary"
                >
                  Criar conta
                </Link>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <Link
                  href="#"
                  onPress={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                  className="text-primary"
                >
                  Entrar
                </Link>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

