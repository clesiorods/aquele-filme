"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="danger"
      variant="flat"
      onPress={handleLogout}
      isLoading={loading}
      className="w-full"
    >
      Sair
    </Button>
  );
}

