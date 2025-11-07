# Arquivo: Dockerfile

# 1. Escolha a imagem base. 'node:18-alpine' é leve e moderna.
FROM node:18-alpine

# 2. Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# 3. Copie os arquivos de dependência
COPY package.json package-lock.json ./

# 4. Instale as dependências.
# (O Docker usa o cache aqui. Se 'package.json' não mudou, ele pula esse passo)
RUN npm install

# 5. Copie o resto do código-fonte do seu projeto
COPY . .

# 6. Exponha a porta que sua aplicação usa (EX: 3000, 3333, 8080)
# !!! Altere 3000 para a porta que seu app realmente usa !!!
EXPOSE 3000

# 7. Defina o comando para iniciar sua aplicação
CMD [ "node", "app.js" ]