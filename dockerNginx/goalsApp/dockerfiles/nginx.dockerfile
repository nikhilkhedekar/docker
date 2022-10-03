FROM nginx

WORKDIR /etc/nginx

RUN rm nginx.conf

COPY nginx/nginx.conf /etc/nginx/
#nginx/nginx.conf .

WORKDIR /var/www/dockerNginx

COPY /src /var/www/dockerNginx
#src .

CMD ["nginx", "-g", "daemon off;"] 
#while hosting/depolyment of app use this command