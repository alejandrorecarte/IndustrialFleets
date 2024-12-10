import pymysql
from dotenv import load_dotenv

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
    
    except pymysql.MySQLError as e:
        raise Exception(message=e)
        
def close_connection(connection):
    connection.close()
    
def execute_query(query:str, params, connection):
    try:
        # Crear un cursor
        with connection.cursor() as cursor:
            # Ejecutar la consulta
            cursor.execute(query, params)
            
            # Confirmar la transacción
            connection.commit()
            
    except pymysql.MySQLError as e:
        connection.rollback()
