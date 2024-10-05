# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Construye el proyecto TypeScript
RUN npm run build

# Expone el puerto que usa tu aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
