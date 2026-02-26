FROM node:25.6.1-alpine3.23

RUN npm install -g npm@9.1.3
WORKDIR /app
COPY server/package.json .
COPY server/package-lock.json .
COPY server/index.js .
RUN npm install
EXPOSE 8080

CMD [ "node", "index.js" ]
