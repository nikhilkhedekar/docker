FROM node

WORKDIR /app

COPY package.json /app/

RUN npm i
 
COPY . /app/

EXPOSE 5672

CMD ["node", "main.js"]