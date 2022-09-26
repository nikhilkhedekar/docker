FROM nginx

WORKDIR /etc/nginx

RUN rm nginx.conf

COPY nginx/nginx.conf /etc/nginx/
#nginx/nginx.conf .

# CMD [ "nginx" "-s" "reload" ] instead of this we are restarting server in docker-compose

WORKDIR /var/www/dockerNginx

COPY src /var/www/dockerNginx
#src .