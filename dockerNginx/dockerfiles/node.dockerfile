FROM node

WORKDIR /var/www/html

COPY src/package.json /var/www/html
#src/package.json .

RUN npm i
# npm i && npm cache clean --force

COPY src /var/www/html
#src .

EXPOSE 8080

CMD ["npm", "start"]