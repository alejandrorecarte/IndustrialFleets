FROM httpd:latest

RUN apt update && apt install -y \
    libapache2-mod-security2 \
    libapache2-mod-evasive \
    git \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/apache2/htdocs/

COPY ./app /usr/local/apache2/htdocs/

RUN chmod -R 755 /usr/local/apache2/htdocs/

COPY ./conf/proxy.conf /usr/local/apache2/conf/extra/proxy.conf
COPY ./conf/modsecurity/modsecurity.conf /etc/modsecurity/modsecurity.conf
COPY ./conf/evasive.conf /etc/apache2/mods-available/evasive.conf
COPY ./conf/default-ssl.conf /usr/local/apache2/conf/extra/default-ssl.conf

RUN mkdir -p /var/log/apache2 && chmod 755 /var/log/apache2

RUN echo "IncludeOptional /etc/modsecurity/modsecurity.conf" >> /usr/local/apache2/conf/httpd.conf \
    && echo "Include /usr/local/apache2/conf/extra/proxy.conf" >> /usr/local/apache2/conf/httpd.conf

RUN echo "LoadModule proxy_module modules/mod_proxy.so" >> /usr/local/apache2/conf/httpd.conf \
    && echo "LoadModule proxy_http_module modules/mod_proxy_http.so" >> /usr/local/apache2/conf/httpd.conf \
    && echo "LoadModule unique_id_module modules/mod_unique_id.so" >> /usr/local/apache2/conf/httpd.conf

RUN rm -rf /etc/modsecurity/crs \
    && mkdir -p /etc/modsecurity/crs \
    && git clone --depth 1 https://github.com/coreruleset/coreruleset.git /etc/modsecurity/crs \
    && mv /etc/modsecurity/crs/crs-setup.conf.example /etc/modsecurity/crs/crs-setup.conf


RUN echo "Include /etc/modsecurity/crs/crs-setup.conf" >> /etc/modsecurity/modsecurity.conf \
    && echo "Include /etc/modsecurity/crs/rules/*.conf" >> /etc/modsecurity/modsecurity.conf


RUN mkdir -p /etc/apache2/mods-enabled


RUN echo "LoadModule security2_module /usr/lib/apache2/modules/mod_security2.so" >> /usr/local/apache2/conf/httpd.conf


RUN evasive_module_path=$(find / -name 'mod_evasive*.so' | head -n1) && \
    if [ -z "$evasive_module_path" ]; then \
      echo "mod_evasive module not found"; exit 1; \
    fi && \
    echo "LoadModule evasive20_module ${evasive_module_path}" >> /usr/local/apache2/conf/httpd.conf


RUN ln -s /etc/apache2/mods-available/evasive.conf /etc/apache2/mods-enabled/evasive.conf \
    && ln -s /etc/apache2/mods-available/evasive.load /etc/apache2/mods-enabled/evasive.load


RUN echo "LoadModule ssl_module modules/mod_ssl.so" >> /usr/local/apache2/conf/httpd.conf


RUN echo "Listen 443" >> /usr/local/apache2/conf/httpd.conf


RUN mkdir -p /etc/ssl/private /etc/ssl/certs


RUN openssl genrsa -des3 -passout pass:Alumno -out /etc/ssl/private/server.key 2048


RUN openssl req -new -key /etc/ssl/private/server.key -passin pass:Alumno \
    -subj "/C=ES/ST=Madrid/L=Mostoles/O=CAM/OU=ciberIES/CN=www.ciberZXX.org/emailAddress=tu@correo.com" \
    -out /etc/ssl/private/server.csr


RUN openssl x509 -req -days 365 -in /etc/ssl/private/server.csr -signkey /etc/ssl/private/server.key -passin pass:Alumno \
    -out /etc/ssl/certs/server.crt && rm /etc/ssl/private/server.csr


RUN echo '#!/bin/bash' > /etc/ssl/private/pass.sh && \
    echo 'echo "Alumno"' >> /etc/ssl/private/pass.sh && \
    chmod u+x /etc/ssl/private/pass.sh


RUN echo "SSLPassPhraseDialog exec:/etc/ssl/private/pass.sh" >> /usr/local/apache2/conf/httpd.conf


# # Configurar el VirtualHost para HTTPS con proxy y demás configuraciones
RUN echo '<IfModule mod_ssl.c>' > /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '    <VirtualHost _default_:443>' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        ServerName 10.227.87.100' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        ServerAdmin webmaster@localhost' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        DocumentRoot "/usr/local/apache2/htdocs"' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        <Directory "/usr/local/apache2/htdocs">' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '            Options -Indexes +FollowSymLinks' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '            AllowOverride None' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '            Require all granted' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        </Directory>' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        ErrorLog "/usr/local/apache2/logs/error_log"' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        CustomLog "/usr/local/apache2/logs/access_log" common' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        SSLEngine on' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        SSLCertificateFile "/etc/ssl/certs/server.crt"' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        SSLCertificateKeyFile "/etc/ssl/private/server.key"' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        SSLProxyEngine on' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        ProxyPass /api http://fastapi:8000' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        ProxyPassReverse /api http://fastapi:8000' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        <IfModule security2_module>' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '            SecRuleEngine On' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '        </IfModule>' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '    </VirtualHost>' >> /usr/local/apache2/conf/extra/default-ssl.conf && \
    echo '</IfModule>' >> /usr/local/apache2/conf/extra/default-ssl.conf


RUN echo "Include conf/extra/default-ssl.conf" >> /usr/local/apache2/conf/httpd.conf


EXPOSE 80
EXPOSE 443


CMD ["apachectl", "-D", "FOREGROUND"]
