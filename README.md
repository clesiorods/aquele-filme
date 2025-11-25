# 🎬 AQUELE FILME

Sistema de gerenciamento pessoal de filmes desenvolvido com Next.js 15, TypeORM e MySQL. Gerencie sua lista de filmes assistidos e desejados com uma interface moderna e intuitiva.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Routes](#api-routes)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Scripts Disponíveis](#scripts-disponíveis)

## 🎯 Sobre o Projeto

**AQUELE FILME** é uma aplicação web full-stack para gerenciamento pessoal de filmes. Permite que usuários cadastrem, organizem e avaliem seus filmes favoritos, separando entre "Já vi" e "Quero ver". O sistema inclui controle de acesso baseado em roles, onde apenas administradores podem gerenciar usuários.

## ✨ Funcionalidades

### 🎥 Gerenciamento de Filmes
- ✅ Cadastro de filmes com título, sinopse, capa, duração e comentários
- ⭐ Sistema de avaliação por estrelas (0-5)
- 📊 Filtros por status: "Já vi" ou "Quero ver"
- 🔍 Busca por título
- 🎴 Cards interativos com efeito 3D ao passar o mouse
- 🔄 Flip card para visualizar sinopse completa
- ✏️ Edição e exclusão de filmes

### 👥 Gerenciamento de Usuários (Apenas Administradores)
- 👤 Listagem de todos os usuários
- ➕ Criação de novos usuários
- ✏️ Edição de usuários (nome, email, senha, status de admin)
- 🗑️ Exclusão de usuários
- 🔍 Busca por nome ou email
- 🔐 Controle de acesso baseado em roles (isAdmin)

### 🔐 Autenticação
- 🔑 Login e registro de usuários
- 🔒 Senhas criptografadas com bcrypt
- 👁️ Botão para mostrar/ocultar senha
- 🍪 Sessões baseadas em cookies
- 🚪 Logout seguro

### 🎨 Interface
- 🌓 Suporte a tema claro/escuro
- 📱 Design responsivo
- 🎭 Animações e transições suaves
- 💫 Efeitos 3D nos cards de filmes
- 🎨 UI moderna com HeroUI

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.3.1** - Framework React com App Router
- **React 18.3.1** - Biblioteca JavaScript
- **HeroUI 2.x** - Biblioteca de componentes UI
- **Tailwind CSS 4.1.11** - Framework CSS utilitário
- **Framer Motion 11.18.2** - Biblioteca de animações
- **TypeScript 5.6.3** - Superset JavaScript com tipagem

### Backend
- **Next.js API Routes** - API REST integrada
- **TypeORM 0.3.27** - ORM para TypeScript/JavaScript
- **MySQL2 3.15.3** - Driver MySQL
- **bcryptjs 2.4.3** - Criptografia de senhas

### Ferramentas
- **ESLint** - Linter de código
- **Prettier** - Formatador de código
- **tsx** - Executor TypeScript

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.x ou superior
- **npm**, **yarn**, **pnpm** ou **bun**
- **MySQL** 8.0 ou superior (ou outro banco de dados compatível)
- **Git** (opcional)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd aquele-filme
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco

# Ambiente
NODE_ENV=development
```

4. **Execute as migrations**

```bash
npm run migration:run
```

5. **Execute o seed (opcional)**

Para criar um usuário de demonstração inicial:

```bash
npm run seed
```

Isso criará o seguinte usuário:

**Usuário de Demonstração:**
- **Email:** `demonstracao@demonstracao.com`
- **Senha:** `demonstracao@123`
- **isAdmin:** `false`

## ⚙️ Configuração

### Variáveis de Ambiente

O arquivo `.env` deve conter:

```env
DB_HOST=localhost          # Host do banco de dados
DB_PORT=3306               # Porta do banco de dados
DB_USER=root               # Usuário do banco de dados
DB_PASSWORD=senha123       # Senha do banco de dados
DB_NAME=aquele_filme       # Nome do banco de dados
NODE_ENV=development       # Ambiente (development/production)
```

### Banco de Dados

O projeto utiliza MySQL. Certifique-se de que:

1. O MySQL está rodando
2. O banco de dados foi criado
3. As credenciais no `.env` estão corretas
4. As migrations foram executadas

## 🎮 Uso

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Produção

1. **Build do projeto**
```bash
npm run build
```

2. **Inicie o servidor de produção**
```bash
npm start
```

### Primeiro Acesso

1. Acesse `http://localhost:3000/login`
2. Se executou o seed, você pode usar:
   - **Demonstração:** `demonstracao@demonstracao.com` / `demonstracao@123`
3. Ou crie uma nova conta clicando em "Criar conta"

## 📁 Estrutura do Projeto

```
aquele-filme/
├── app/                      # App Router do Next.js
│   ├── api/                  # API Routes
│   │   ├── auth/             # Autenticação (login, logout, register, me)
│   │   ├── movies/           # CRUD de filmes
│   │   └── users/            # CRUD de usuários (apenas admin)
│   ├── filmes/               # Página de listagem de filmes
│   ├── usuarios/             # Página de gerenciamento de usuários
│   ├── login/                # Página de login/registro
│   ├── dashboard/            # Dashboard do usuário
│   └── layout.tsx            # Layout principal
├── components/               # Componentes React
│   ├── movie-card.tsx        # Card de filme com efeito 3D
│   ├── movie-form.tsx        # Formulário de filme
│   ├── navbar.tsx            # Barra de navegação
│   └── star-rating.tsx       # Componente de avaliação
├── entities/                 # Entidades TypeORM
│   ├── User.ts               # Entidade Usuário
│   └── Movie.ts              # Entidade Filme
├── lib/                      # Utilitários
│   ├── auth.ts               # Funções de autenticação
│   └── db.ts                 # Configuração do banco
├── migrations/               # Migrations do TypeORM
│   ├── 1700000000000-CreateUsers.ts
│   ├── 1700000000001-CreateMovies.ts
│   └── 1700000000002-AddIsAdminToUsers.ts
├── scripts/                  # Scripts auxiliares
│   ├── migration.ts          # Executar migrations
│   ├── migration-revert.ts   # Reverter migrations
│   └── seed.ts               # Popular banco com dados iniciais
└── config/                   # Configurações
    ├── fonts.ts              # Configuração de fontes
    └── site.ts               # Configuração do site
```

## 🔌 API Routes

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter usuário atual

### Filmes

- `GET /api/movies` - Listar filmes do usuário (com filtro opcional `?watched=true/false`)
- `POST /api/movies` - Criar novo filme
- `GET /api/movies/[id]` - Obter filme específico
- `PUT /api/movies/[id]` - Atualizar filme
- `DELETE /api/movies/[id]` - Deletar filme

### Usuários (Apenas Admin)

- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar novo usuário
- `GET /api/users/[id]` - Obter usuário específico
- `PUT /api/users/[id]` - Atualizar usuário
- `DELETE /api/users/[id]` - Deletar usuário

## 🔐 Autenticação e Autorização

### Sistema de Autenticação

- Autenticação baseada em sessões (cookies HTTP-only)
- Senhas criptografadas com bcrypt (10 rounds)
- Sessões válidas por 7 dias

### Controle de Acesso

- **Usuários comuns:** Podem gerenciar apenas seus próprios filmes
- **Administradores (`isAdmin: true`):** Podem acessar o módulo de gerenciamento de usuários

### Proteção de Rotas

- Rotas de API verificam autenticação via `getCurrentUser()`
- Rotas de usuários verificam `isAdmin` antes de permitir acesso
- Páginas redirecionam para `/login` se não autenticado

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Produção
npm run build            # Cria build de produção
npm start                # Inicia servidor de produção

# Banco de Dados
npm run migration:run    # Executa todas as migrations pendentes
npm run migration:revert  # Reverte a última migration
npm run seed             # Popula o banco com dados iniciais

# Qualidade de Código
npm run lint             # Executa o linter e corrige problemas
```

## 🎨 Características da Interface

### Cards de Filmes
- **Efeito 3D:** Rotação suave ao passar o mouse
- **Flip Card:** Clique no card para ver sinopse completa
- **Visualização:** Capa, título, sinopse, avaliação e comentários
- **Ações:** Botões para ver detalhes e deletar

### Design Responsivo
- Layout adaptável para desktop, tablet e mobile
- Menu hambúrguer em dispositivos móveis
- Cards que se ajustam ao tamanho da tela

### Tema
- Suporte a tema claro e escuro
- Alternância automática baseada nas preferências do sistema
- Switch manual na navbar

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Cookies HTTP-only para sessões
- ✅ Validação de dados no servidor
- ✅ Proteção contra SQL Injection (TypeORM)
- ✅ Controle de acesso baseado em roles
- ✅ Validação de autenticação em todas as rotas protegidas

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Next.js e HeroUI
