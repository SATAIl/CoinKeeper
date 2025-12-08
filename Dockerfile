FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY entrypoint.sh ./

RUN npm install

RUN npx prisma generate

COPY src ./src

RUN npm run build

RUN chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]

CMD ["npm", "start"]
