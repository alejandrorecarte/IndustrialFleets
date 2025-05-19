FROM mariadb:10.11.5

# Copia archivos como root para asegurarte de que se colocan correctamente
COPY mariadb/init.sql /docker-entrypoint-initdb.d/

# Cambia al usuario ya existente y seguro
USER mysql

EXPOSE 3306

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD mysqladmin ping -h 127.0.0.1 -u root -p"$MYSQL_ROOT_PASSWORD" || exit 1

CMD ["docker-entrypoint.sh", "mysqld"]
