FROM httpd:2.4.57

RUN apt-get update && apt-get install -y \
      libapache2-mod-security2 \
      libapache2-mod-evasive \
      git \
      openssl \
      apache2-utils \
    && rm -rf /var/lib/apt/lists/*


RUN groupadd -r appuser && useradd -r -g appuser appuser \
    && mkdir -p /usr/local/apache2/htdocs \
    && chown -R appuser:appuser /usr/local/apache2/htdocs

# Añadido para que logs sea accesible por appuser
RUN mkdir -p /usr/local/apache2/logs && chown -R appuser:appuser /usr/local/apache2/logs
COPY ./conf/proxy.conf /usr/local/apache2/conf/proxy.conf
RUN chmod 644 /usr/local/apache2/conf/proxy.conf && echo 'Include conf/proxy.conf' >> /usr/local/apache2/conf/httpd.conf

USER appuser

WORKDIR /usr/local/apache2/htdocs/
COPY --chown=appuser:appuser ./app /usr/local/apache2/htdocs/

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl --fail http://localhost:80/ || exit 1

EXPOSE 80
EXPOSE 443

CMD ["apachectl", "-D", "FOREGROUND"]
