# Arquivo: infra/outputs.tf

# Pede ao Terraform para mostrar o endereço IP público do nosso servidor
output "ip_do_servidor" {
  value = digitalocean_droplet.web_server.ipv4_address
}