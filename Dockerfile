FROM node:boron

RUN mkdir /app
RUN mkdir /app/lib
RUN mkdir /app/bin

COPY src /app/lib
COPY bin /app/bin
COPY package.json /app/package.json
COPY config.json /app/config.json

WORKDIR /app/

RUN npm install
RUN npm run build

EXPOSE 4444

CMD [ "node", "/app/bin/ap-npm", "serve", "--config=/ap-npm/config.json"]
