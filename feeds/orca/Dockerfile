FROM node:16

WORKDIR /app

ENV RPC_URL=http://185.209.177.4:8899

COPY package.json .

RUN npm install

COPY . .

CMD ["./node_modules/.bin/ts-node", "./src/index.ts"]
