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

      // Redirecionar para página de filmes após login/registro bem-sucedido
      router.push("/filmes");
      router.refresh();
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-10 px-4 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-display font-black bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-widest uppercase drop-shadow-2xl" style={{ letterSpacing: '0.15em' }}>
          AQUELE FILME
        </h1>
        <p className="text-default-500 text-sm md:text-base font-display font-light tracking-wide">
          Gerencie seus filmes favoritos
        </p>
      </div>

      <Card className="w-full max-w-md shadow-2xl border border-default-200/50 backdrop-blur-sm bg-background/80">
        <CardHeader className="flex flex-col gap-2 items-center pt-8 pb-4">
          <h2 className={`text-2xl font-display font-bold ${isLogin ? 'text-primary' : 'text-secondary'}`}>
            {isLogin ? "Entrar" : "Criar Conta"}
          </h2>
          <p className="text-default-500 text-sm font-display">
            {isLogin ? "Acesse sua conta" : "Comece sua jornada cinematográfica"}
          </p>
        </CardHeader>
        <CardBody className="gap-5 pb-8 px-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                classNames={{
                  input: "font-display",
                  label: "font-display font-medium",
                }}
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
              classNames={{
                input: "font-display",
                label: "font-display font-medium",
              }}
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
              classNames={{
                input: "font-display",
                label: "font-display font-medium",
              }}
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
              <div className="text-danger text-sm text-center font-display p-3 rounded-lg bg-danger/10 border border-danger/20">
                {error}
              </div>
            )}
            <Button
              type="submit"
              color="primary"
              className="w-full font-display font-semibold text-base h-12"
              isLoading={loading}
              size="lg"
            >
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>
          <div className="text-center text-sm font-display pt-2">
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

