# 🎬 API Clube do Filme (Movie-Rats)

Este repositório contém o código-fonte de uma API RESTful para um aplicativo de avaliação de filmes ("Clube do Filme").

O projeto foi desenvolvido para um **Desafio Backend**, cumprindo todos os requisitos de lógica de aplicação, segurança e banco de dados. Além disso, o projeto foi **além dos requisitos** ao implementar um fluxo completo de DevOps, provisionando automaticamente a infraestrutura na nuvem (DigitalOcean) usando **Terraform** e **Docker**.

---

## 🎯 Funcionalidades Principais (Backend)

A aplicação foi construída em Node.js e cumpre todos os requisitos do desafio:

* **✅ CRUD Completo:** API permite criar, ler, atualizar e deletar as 3 entidades principais:
    * **Usuários** (`/users`)
    * **Filmes** (`/filmes`)
    * **Reviews** (`/reviews`)
* **✅ Autenticação e Autorização:**
    * Sistema de login (`/login`) funcional com e-mail e senha.
    * Uso de **Tokens JWT** (`Bearer Token`) para gerenciamento de sessão após o login.
* **✅ Níveis de Acesso:**
    * Implementação de dois níveis de usuário: **Usuário Padrão** e **Administrador**.
    * Rotas de criação, atualização e deleção de filmes são protegidas e acessíveis apenas por **Administradores**.
* **✅ Banco de Dados Relacional:** Utilização do **PostgreSQL** para persistência dos dados.
* **✅ Containerização:** A aplicação e o banco de dados são totalmente containerizados com **Docker** e **Docker Compose** para fácil execução.

---

## 🚀 Tecnologias Utilizadas

### 💻 Aplicação & Dados
* **Node.js:** Ambiente de execução da API.
* **Express:** Framework para gerenciamento de rotas e middlewares.
* **PostgreSQL:** Banco de dados relacional.
* **JSON Web Token (JWT):** Para autenticação e gerenciamento de sessão.
* **bcrypt.js:** Para criptografia de senhas (hashing).
* **dotenv:** Para gerenciamento de variáveis de ambiente.

### ☁️ DevOps & Infraestrutura (Indo Além)
* **Docker & Docker Compose:** Containerização da aplicação e do banco de dados.
* **Terraform (IaC):** Provisionamento da infraestrutura como código.
* **DigitalOcean:** Provedor de nuvem para hospedar o servidor (Droplet).
* **SSH (Secure Shell):** Configuração de chaves para acesso seguro ao servidor.
* **UFW (Firewall):** Configuração do firewall do servidor para liberar a porta da aplicação.

---

## 🔧 Como Executar (Localmente)

Para rodar este projeto na sua máquina local, você precisa ter o **Docker** e o **Docker Compose** instalados.

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/samuelZ20/Movie-Rats.git](https://github.com/samuelZ20/Movie-Rats.git)
    cd Movie-Rats
    ```

2.  Crie um arquivo `.env` na raiz do projeto. Você pode copiar o `.env.example` (se existir) ou usar este modelo. O `DB_HOST` deve ser `db`.
    ```.env
    # Configuração da Aplicação
    PORT=3000

    # Configuração do Banco (para Docker Compose)
    DB_HOST=db
    DB_PORT=5433
    DB_USER=postgres
    DB_PASSWORD=meusecret
    DB_NAME=meubanco

    # Segredo do JWT
    JWT_SECRET=seu_segredo_aqui
    ```

3.  Suba os contêineres:
    ```bash
    docker-compose up -d --build
    ```

4.  A API estará disponível em `http://localhost:3000`.

---

## 📖 Documentação dos Endpoints da API

A API está dividida por nível de acesso.

### Autenticação (Público)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Cria um novo usuário (Usuário Padrão). | Público |
| `POST` | `/login` | Autentica um usuário e retorna um token JWT. | Público |

### Usuários (Autenticado)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Lista todos os usuários. | Autenticado (User) |
| `GET` | `/users/me`| Retorna os detalhes do usuário autenticado. | Autenticado (User) |
| `PUT` | `/users/me`| Atualiza os detalhes do usuário autenticado. | Autenticado (User) |

### Filmes (CRUD)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `GET` | `/filmes` | Lista todos os filmes. | Público |
| `GET` | `/filmes/:id` | Busca um filme específico por ID. | Público |
| `POST` | `/filmes` | **(Protegido)** Cria um novo filme. | Autenticado (Admin) |
| `PUT` | `/filmes/:id` | **(Protegido)** Atualiza um filme por ID. | Autenticado (Admin) |
| `DELETE`| `/filmes/:id` | **(Protegido)** Deleta um filme por ID. | Autenticado (Admin) |

### Reviews (Avaliações)
| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/reviews` | Cria uma nova review para um filme. | Autenticado (User) |
| `GET` | `/reviews/:filmeId` | Lista todas as reviews de um filme específico. | Público |
| `PUT` | `/reviews/:id` | Atualiza uma review (somente o próprio autor). | Autenticado (User) |
| `DELETE`| `/reviews/:id` | Deleta uma review (somente o próprio autor). | Autenticado (User) |

---

## 🛰️ Como Executar (Deploy na Nuvem com Terraform)

Esta seção documenta como provisionar automaticamente a infraestrutura na DigitalOcean.

**Pré-requisitos:**
* [Terraform](https://www.terraform.io/) instalado.
* Uma conta na [DigitalOcean](https://www.digitalocean.com/).
* Um Token de API da DigitalOcean (criado no painel de "API").
* Um par de chaves SSH (pública e privada) gerado no seu PC e a chave pública adicionada ao painel da DigitalOcean.

### Passo 1: Provisionar o Servidor
1.  Navegue até a pasta de infraestrutura:
    ```bash
    cd infra
    ```
2.  (Opcional) Ajuste o `main.tf` para que o `name` da `data "digitalocean_ssh_key"` seja igual ao nome da sua chave no DigitalOcean.

3.  Defina seu token de acesso como uma variável de ambiente:
    ```powershell
    # Exemplo para PowerShell
    $env:DIGITALOCEAN_TOKEN = "seu_token_aqui"
    ```

4.  Inicialize o Terraform (só na primeira vez):
    ```bash
    terraform init
    ```

5.  Crie a infraestrutura (servidor):
    ```bash
    terraform apply
    ```
    (Digite `yes` para confirmar)

6.  Obtenha o IP do servidor:
    ```bash
    terraform output ip_do_servidor
    ```

### Passo 2: Deploy Manual da Aplicação
1.  Acesse seu novo servidor via SSH (use o IP do passo anterior):
    ```bash
    ssh root@IP_DO_SERVIDOR
    ```

2.  Instale o Docker, Docker Compose e Git:
    ```bash
    apt update
    apt install docker.io docker-compose git -y
    ```

3.  Clone o seu projeto **dentro do servidor**:
    ```bash
    git clone https://github.com/samuelZ20/Movie-Rats.git
    cd Movie-Rats
    ```

4.  Crie o arquivo `.env, para isso: nano .env` **dentro do servidor** (siga o mesmo modelo da seção local).
5.  (Isso vai abrir uma tela preta vazia, que é o editor de texto).

Cole as configurações: Copie o texto abaixo e cole dentro dessa tela preta (clique com o botão direito do mouse no terminal para colar):

Ini, TOML

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=meusecret
DB_NAME=meubanco
JWT_SECRET=seu_segredo_super_secreto
Salve e Saia:

Aperte Ctrl + O (letra O) e depois Enter (para salvar).

Aperte Ctrl + X (para sair do editor).

6.  Abra o firewall do servidor para a porta da sua API:
    ```bash
    ufw allow 3000/tcp
    ```

7.  Suba os contêineres **no servidor**:
    ```bash
    docker-compose up -d --build
    ```

8.  **Pronto!** A sua API estará publicamente acessível em `http://IP_DO_SERVIDOR:3000`.

---

## 🗑️ Como Destruir a Infraestrutura

Para evitar custos, destrua toda a infraestrutura criada pelo Terraform com um único comando.

```bash
# Na pasta /infra (no seu PC)
terraform destroy
