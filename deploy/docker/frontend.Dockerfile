FROM nginx:1.27-alpine

COPY deploy/docker/nginx-frontend.conf /etc/nginx/conf.d/default.conf
COPY frontend/ /usr/share/nginx/html/
