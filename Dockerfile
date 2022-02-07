FROM node:latest

WORKDIR /home/api

COPY . .

RUN npm install

CMD npm run dev