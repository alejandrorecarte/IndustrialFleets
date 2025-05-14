# 1. Imagen base con versión fija
FROM httpd:2.4.57

# 2. Instalar paquetes con apt-get
RUN apt-get update && apt-get install -y \
      libapache2-mod-security2 \
      libapache2-mod-evasive \
      git \
      openssl \
    && rm -rf /var/lib/apt/lists/*

# 3. Crear y usar usuario no root
RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && mkdir -p /usr/local/apache2/htdocs \
    && chown -R appuser:appuser /usr/local/apache2/htdocs
USER appuser

WORKDIR /usr/local/apache2/htdocs/
COPY --chown=appuser:appuser ./app /usr/local/apache2/htdocs/

# 4. Configuraciones de Apache y módulos...
# (mantener tus comandos COPY, RUN, etc. aquí)

# 5. Añadir HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl --fail http://localhost:80/ || exit 1

EXPOSE 80
EXPOSE 443

CMD ["apachectl", "-D", "FOREGROUND"]
