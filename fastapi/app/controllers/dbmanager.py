import pymysql
from dotenv import load_dotenv

def connect_to_db(host: str, user:str, password:str, database:str):
    try:
        # Conectar a la base de datos
        connection = pymysql.connect(
            host,
            user,
            password,
            database
        )
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT DATABASE();")
            db_info = cursor.fetchone()
            print(f"Conectado a la base de datos: {db_info}")
    
    except pymysql.MySQLError as e:
        print(f"Error al conectar a MariaDB: {e}")
    
    finally:
        connection.close()
