# Dockerfile
FROM nginx:alpine

# Copier les fichiers du portfolio dans le dossier nginx
COPY . /usr/share/nginx/html

# Copier la config nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Nginx démarre automatiquement
CMD ["nginx", "-g", "daemon off;"]