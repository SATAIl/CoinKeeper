FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
