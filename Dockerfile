FROM node:18

# Instalar netcat
RUN apt-get update && apt-get install -y netcat-openbsd

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]