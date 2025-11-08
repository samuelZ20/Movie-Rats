# Arquivo: infra/main.tf
# 1. Configura o Terraform para usar o provedor DigitalOcean
terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

# 2. Configura o provedor.
# (Ele vai pegar o token automaticamente da sua variável de ambiente)
provider "digitalocean" {}

# 3. Aqui "desenhamos" nosso servidor (Droplet)
resource "digitalocean_droplet" "web_server" {
  image  = "ubuntu-22-04-x64"            # Imagem do sistema operacional
  name   = "servidor-do-projeto"         # Nome do servidor
  region = "nyc3"                         # Região (Nova Iorque 3)
  size   = "s-1vcpu-1gb"                 # Tamanho (o mais barato)
  ssh_keys = [data.digitalocean_ssh_key.minha_chave.id]
}

# 4. Encontra a chave SSH pelo nome que registou
data "digitalocean_ssh_key" "minha_chave" {
  name = "minha-chave" 
}