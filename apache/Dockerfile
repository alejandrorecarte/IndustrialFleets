# Usar la imagen base oficial de httpd
FROM httpd:latest

# Instalar Apache, mod_security, mod_evasive y otras herramientas necesarias
RUN apt update && apt install -y \
    apache2 \
    libapache2-mod-security2 \
    libapache2-mod-evasive \
    && rm -rf /var/lib/apt/lists/*

# Establecer el directorio de trabajo donde estarán los archivos estáticos
WORKDIR /usr/local/apache2/htdocs/

# Copiar tus archivos estáticos (HTML, CSS, JS) al contenedor
COPY ./ /usr/local/apache2/htdocs/

# Asegurar que los archivos tienen los permisos correctos
RUN chmod -R 755 /usr/local/apache2/htdocs/

# Copiar configuración personalizada de Apache y de los módulos
COPY ./conf/proxy.conf /etc/apache2/sites-available/proxy.conf
COPY ./conf/modsecurity.conf /etc/modsecurity/modsecurity.conf
COPY ./conf/evasive.conf /etc/apache2/mods-available/evasive.conf
COPY ./conf/proxy.conf /usr/local/apache2/conf/extra/proxy.conf

# Incluir la configuración personalizada en Apache
RUN echo "IncludeOptional /etc/modsecurity/modsecurity.conf" >> /usr/local/apache2/conf/httpd.conf \
    && echo "Include /etc/apache2/sites-available/proxy.conf" >> /usr/local/apache2/conf/httpd.conf \
    && echo "Include /usr/local/apache2/conf/extra/proxy.conf" >> /usr/local/apache2/conf/httpd.conf

# Cargar módulos necesarios para proxy y reescritura
RUN echo "LoadModule proxy_module modules/mod_proxy.so" >> /usr/local/apache2/conf/httpd.conf \
    && echo "LoadModule proxy_http_module modules/mod_proxy_http.so" >> /usr/local/apache2/conf/httpd.conf \
    && echo "LoadModule rewrite_module modules/mod_rewrite.so" >> /usr/local/apache2/conf/httpd.conf

# Agregar la carga explícita de mod_security desde la ruta correcta
RUN echo "LoadModule security2_module /usr/lib/apache2/modules/mod_security2.so" >> /usr/local/apache2/conf/httpd.conf

# Habilitar los módulos de Apache (security2, evasive, proxy, proxy_http, rewrite)
RUN ln -s -f /etc/apache2/mods-available/security2.load /etc/apache2/mods-enabled/security2.load \
    && ln -s -f /etc/apache2/mods-available/evasive.load /etc/apache2/mods-enabled/evasive.load \
    && ln -s -f /etc/apache2/mods-available/proxy.load /etc/apache2/mods-enabled/proxy.load \
    && ln -s -f /etc/apache2/mods-available/proxy_http.load /etc/apache2/mods-enabled/proxy_http.load \
    && ln -s -f /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load

# Exponer el puerto 80
EXPOSE 80

# Iniciar Apache en primer plano
CMD ["apachectl", "-D", "FOREGROUND"]
