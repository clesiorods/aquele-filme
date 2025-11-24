import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { getCurrentUser } from "@/lib/auth";
import { title, subtitle } from "@/components/primitives";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className={title()}>Bem-vindo, {user.name}!</h1>
        <p className={subtitle({ class: "mt-2" })}>
          Esta é sua área logada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-col gap-1 items-start">
            <h2 className="text-xl font-semibold">Perfil</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Nome:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">ID:</span> {user.id}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-1 items-start">
            <h2 className="text-xl font-semibold">Informações</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Membro desde:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </p>
              <p>
                <span className="font-medium">Última atualização:</span>{" "}
                {new Date(user.updatedAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-1 items-start">
            <h2 className="text-xl font-semibold">Ações</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <LogoutButton />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

