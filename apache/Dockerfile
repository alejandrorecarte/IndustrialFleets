# Imagen base de Apache
FROM httpd:latest

# Establecer el directorio de trabajo donde estarán los archivos estáticos
WORKDIR /usr/local/apache2/htdocs/

# Copiar tus archivos estáticos (HTML, CSS, JS) al contenedor
COPY /apache /usr/local/apache2/htdocs/

# Exponer el puerto 80 para Apache
EXPOSE 80

# Comando para iniciar Apache
CMD ["httpd-foreground"]