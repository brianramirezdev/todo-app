FROM node:20-alpine

# 1. Directorio de trabajo
WORKDIR /app

# 2. Copiar package.json y lock
COPY package*.json ./

# 3. Instalar TODAS las dependencias (incluye dev)
RUN npm ci

# 4. Copiar el código fuente
COPY . .

# 5. Exponer el puerto del backend
EXPOSE 3000

# 6. Arranque:
#    - corre migraciones en TS
#    - arranca backend con ts-node + aliases
CMD ["npm", "run", "start:migrate"]
