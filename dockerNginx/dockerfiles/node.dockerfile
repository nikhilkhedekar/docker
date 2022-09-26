FROM node

WORKDIR /var/www/dockerNginx

COPY src/package.json /var/www/dockerNginx
#src/package.json .

RUN npm i
# npm i && npm cache clean --force

COPY src /var/www/dockerNginx
#src .

EXPOSE 8080

CMD ["npm", "start"]