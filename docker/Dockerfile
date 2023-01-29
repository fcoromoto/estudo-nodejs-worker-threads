FROM node:19.5.0-slim

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "run", "start"]
