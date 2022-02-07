FROM node:16

WORKDIR /home/api

COPY . .

RUN npm install

CMD npm run dev