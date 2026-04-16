FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/cache/nginx/next

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
