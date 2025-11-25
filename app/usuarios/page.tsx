"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { title, subtitle } from "@/components/primitives";
import { EyeIcon, EyeSlashIcon } from "@/components/icons";

interface User {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    isAdmin: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (response.status === 403) {
        alert("Acesso negado. Apenas administradores podem acessar esta página.");
        router.push("/filmes");
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao carregar usuários");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ email: "", name: "", password: "", isAdmin: false });
    setIsPasswordVisible(false);
    onOpen();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email, name: user.name, password: "", isAdmin: user.isAdmin });
    setIsPasswordVisible(false);
    onOpen();
  };

  const handleModalClose = () => {
    setEditingUser(null);
    setFormData({ email: "", name: "", password: "", isAdmin: false });
    setIsPasswordVisible(false);
    onClose();
  };

  const handleSave = async () => {
    if (!formData.email || !formData.name) {
      alert("Email e nome são obrigatórios");
      return;
    }

    if (!editingUser && !formData.password) {
      alert("Senha é obrigatória para novos usuários");
      return;
    }

    setFormLoading(true);
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";
      const body = editingUser
        ? { email: formData.email, name: formData.name, isAdmin: formData.isAdmin, ...(formData.password && { password: formData.password }) }
        : { email: formData.email, name: formData.name, password: formData.password, isAdmin: formData.isAdmin };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Erro ao salvar usuário");
        return;
      }

      handleModalClose();
      fetchUsers();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) {
      return;
    }

    setIsDeleting(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Erro ao deletar usuário");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      alert("Erro ao deletar usuário");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className={title()}>Gerenciamento de Usuários</h1>
        <p className={subtitle()}>
          Gerencie os usuários do sistema
        </p>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center p-4">
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
            size="sm"
          />
          <Button color="primary" onPress={handleCreate}>
            Novo Usuário
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-default-500">
              {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
            </div>
          ) : (
            <Table aria-label="Tabela de usuários">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Nome</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Admin</TableColumn>
                <TableColumn>Data de Criação</TableColumn>
                <TableColumn>Ações</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Chip color="primary" size="sm" variant="flat">Admin</Chip>
                      ) : (
                        <Chip color="default" size="sm" variant="flat">Usuário</Chip>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => handleEdit(user)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => handleDelete(user.id)}
                          isLoading={isDeleting === user.id}
                        >
                          Deletar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editingUser ? "Editar Usuário" : "Novo Usuário"}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Nome"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired
                isDisabled={formLoading}
                autoComplete="off"
              />
              <Input
                label="Email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                isRequired
                isDisabled={formLoading}
                autoComplete="off"
              />
              <Switch
                isSelected={formData.isAdmin}
                onValueChange={(isAdmin) =>
                  setFormData({ ...formData, isAdmin })
                }
                isDisabled={formLoading}
              >
                Administrador
              </Switch>
              <Input
                label={editingUser ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={editingUser ? "Deixe em branco para manter a senha atual" : "Mínimo 4 caracteres"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                isRequired={!editingUser}
                isDisabled={formLoading}
                description={editingUser ? "Deixe em branco para manter a senha atual" : "Mínimo 4 caracteres"}
                autoComplete="new-password"
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
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={handleModalClose}
              isDisabled={formLoading}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              isLoading={formLoading}
            >
              {editingUser ? "Atualizar" : "Criar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

