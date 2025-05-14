# 1. Usa un tag de versión específico en lugar de 'latest' (p.ej. 10.11.5)
FROM mariadb:10.11.5

LABEL maintainer="alejandro.recarte.rebollo@gmail.com"

# 2. Instala archivos de inicialización
COPY mariadb/init.sql /docker-entrypoint-initdb.d/

# 3. Crea un usuario no root y ajusta permisos
RUN groupadd -r dbuser && useradd -r -g dbuser dbuser \
    && chown -R dbuser:dbuser /var/lib/mysql /docker-entrypoint-initdb.d

# 4. Cambia al usuario no root
USER dbuser

# 5. Exponer el puerto por defecto de MariaDB
EXPOSE 3306

# 6. Añade HEALTHCHECK para verificar la disponibilidad
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD mysqladmin ping -h 127.0.0.1 -u root -p"$MYSQL_ROOT_PASSWORD" || exit 1

# 7. Usa el entrypoint predeterminado de MariaDB
CMD ["docker-entrypoint.sh", "mysqld"]
