import pymysql
from controllers.exceptions import DbException
import logging

def connect_to_db(host: str, port:int, user:str, password:str, database:str):
    try:
        # Conectar a la base de datos
        connection = pymysql.connect(
            host=host,        # Dirección del host (por ejemplo, 'localhost')
            port= port,
            user=user,        # Usuario de la base de datos
            password=password, # Contraseña del usuario
            database=database  # Nombre de la base de datos
        )
        
        return connection
    
    except pymysql.MySQLError as error:
        raise DbException(str(error))
        
def close_connection(connection):
    connection.close()
    
def execute(query:str, params, connection):
    try:
        # Crear un cursor
        with connection.cursor() as cursor:
            # Ejecutar la consulta
            cursor.execute(query, params)
            
            # Confirmar la transacción
            connection.commit()
            
    except pymysql.MySQLError as error:
        connection.rollback()
        raise DbException(str(error))
    
import logging
import pymysql

def execute_query(query: str, params, connection):
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(levelname)s - %(name)s - %(asctime)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('app.log')
        ]
    )

    # Crear un logger
    logger = logging.getLogger(__name__)
    try:
        # Crear un cursor para ejecutar la consulta
        with connection.cursor() as cursor:            
            logger.info(f"Executing query: {query} with params: {params}")
            
            # Ejecutar la consulta con los parámetros
            cursor.execute(query, params)  # Nota: Aquí pasamos `query` y `params` correctamente
            
            # Obtener los resultados
            results = cursor.fetchall()
            logger.info(f"Query results: {results}")
            
            return results
    except pymysql.MySQLError as error:
        connection.rollback()
        logger.warning(f"Error trying to query: {error}")
        raise DbException(str(error))

