# 🎬 Clube do Filme API (Projeto Movie-Rats)

API RESTful para um aplicativo de avaliação de filmes, construída com Node.js e implantada na DigitalOcean usando Terraform e Docker. Este projeto foi desenvolvido como um estudo de ponta a ponta de um fluxo de trabalho DevOps, desde o desenvolvimento do código até a infraestrutura como código (IaC) e o deploy.

---

## 🚀 Tecnologias Utilizadas

Este projeto utiliza um stack moderno focado em automação e escalabilidade:

### **Backend**
* **Node.js:** Ambiente de execução para o JavaScript no servidor.
* **Express:** Framework para a construção da API RESTful.
* **PostgreSQL:** Banco de dados relacional para persistência de dados.

### **DevOps & Infraestrutura**
* **Docker & Docker Compose:** Utilizados para criar contêineres da aplicação e do banco de dados, garantindo um ambiente de desenvolvimento e produção consistente.
* **Terraform (IaC):** Usado para provisionar (criar) e gerenciar a infraestrutura na nuvem (DigitalOcean) de forma automática e declarativa.
* **DigitalOcean:** Provedor de nuvem onde a infraestrutura foi implantada.
* **Ubuntu (Linux):** Sistema operacional do servidor provisionado.
* **UFW (Firewall):** Configurado para liberar o acesso HTTP à aplicação.

---

## 🛠️ O que foi feito?

Este projeto vai além de um simples CRUD. O foco foi implementar o ciclo de vida completo de uma aplicação, incluindo:

* **Desenvolvimento:** Criação de uma API Node.js completa para gerenciar filmes, usuários e reviews.
* **Contêinerização:** Uso do `Dockerfile` e `docker-compose.yml` para "empacotar" a aplicação e o banco de dados.
* **Infraestrutura como Código (IaC):** Criação de um servidor ("Droplet") na DigitalOcean usando **Terraform**, incluindo a configuração de chaves SSH para acesso seguro.
* **Deploy Manual:** Conexão ao servidor via SSH, instalação do ambiente (Docker, Git), clone do repositório e execução dos contêineres na nuvem.
* **Networking:** Configuração do firewall (`ufw`) no servidor para permitir tráfego na porta da aplicação.

---

## 🔧 Como Executar (Localmente)

Para rodar este projeto na sua máquina local, você precisa ter o **Docker** e o **Docker Compose** instalados.

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/seu-usuario/Movie-Rats.git](https://github.com/seu-usuario/Movie-Rats.git)
    cd Movie-Rats
    ```

2.  Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) e configure as variáveis de ambiente. Para rodar com Docker, o `DB_HOST` deve ser `db` (o nome do serviço no `docker-compose.yml`).

3.  Suba os contêineres:
    ```bash
    docker-compose up -d --build
    ```

4.  A API estará disponível em `http://localhost:3000`.

---

## ☁️ Como Executar (Infraestrutura na Nuvem)

Esta seção descreve como provisionar a infraestrutura real na DigitalOcean.

**Pré-requisitos:**
* [Terraform](https://www.terraform.io/) instalado.
* Uma conta na [DigitalOcean](https://www.digitalocean.com/).
* Um Token de API da DigitalOcean (criado no painel de "API").

1.  Navegue até a pasta de infraestrutura:
    ```bash
    cd infra
    ```

2.  Defina seu token de acesso como uma variável de ambiente:
    ```powershell
    # Exemplo para PowerShell
    $env:DIGITALOCEAN_TOKEN = "seu_token_aqui"
    ```

3.  Inicialize o Terraform (só na primeira vez):
    ```bash
    terraform init
    ```

4.  Crie a infraestrutura (servidor e chave SSH):
    ```bash
    terraform apply
    ```

5.  Após o deploy, o Terraform mostrará o IP do servidor. Você pode então acessá-lo via SSH (`ssh root@IP_DO_SERVIDOR`) e seguir os passos de deploy manual (clonar, `docker-compose up`, etc.).

---

## 🗑️ Como Destruir a Infraestrutura

Para evitar custos, destrua toda a infraestrutura criada pelo Terraform com um único comando:

```bash
# Na pasta /infra
terraform destroy
