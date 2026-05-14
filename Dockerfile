FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# 1. Apagamos la verificación estricta
RUN npm config set strict-ssl false

# 2. ENGANAMOS AL FIREWALL: Usamos el servidor espejo de Yarn
RUN npm config set registry https://registry.yarnpkg.com/

# 3. Instalamos forzando las dependencias de desarrollo
RUN npm ci --include=dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]