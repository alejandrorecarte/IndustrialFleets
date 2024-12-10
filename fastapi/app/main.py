from fastapi import FastAPI
from controllers.vehicle import create_vehicle
from models.vehicle import Vehicle
from models.post import Post
from models.user import User
from dotenv import load_dotenv
from controllers.dbmanager import connect_to_db, close_connection
from controllers.user import create_user
import os
import logging
import time

app = FastAPI()

# Configuración del logger
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

# Función de inicialización que se ejecuta al iniciar la aplicación
def init_app():
    try:
        logger.info("Loading environment variables...")
        load_dotenv()
        logger.info("Environment variables successfully loaded.")

        logger.info("Establishing DB connection...")
        connection_tries = int(os.getenv("CONNECTION_TRIES"))
        connection_stablished = False
        while not connection_stablished:
            if connection_tries == 0:
                raise Exception("Could not connect to db.")
            try:
                db_connection = connect_to_db(
                    host=os.getenv("DB_HOST"),  # Usamos la variable de entorno DB_HOST, que es 'db' en Docker Compose
                    port=int(os.getenv("DB_PORT", 3306)),  # Puerto 3306
                    user=os.getenv("DB_USER"),
                    password=os.getenv("DB_PASSWORD"),
                    database=os.getenv("DB_NAME")
                )
                connection_stablished = True
            except Exception:
                logger.info(f"Could not connect to Db, tries remaining: {connection_tries}")
                connection_tries -= 1
                time.sleep(5)
        logger.info("DB connection established.")
        return db_connection

    except Exception as e:
        logger.error(f"Error in app initialization: {e}")
        return None

@app.on_event("startup")
async def startup_event():
    """Evento que se ejecuta al iniciar la aplicación"""
    global db_connection
    db_connection = init_app()

@app.on_event("shutdown")
async def shutdown_event():
    """Evento que se ejecuta al apagar la aplicación"""
    if db_connection:
        logger.info("Closing DB connection...")
        close_connection(db_connection)
        logger.info("DB connection closed.")

@app.post("/user/create")
def post_create_user(email: str, name: str, surname: str, password: str):
    try:
        user = User(email=email, name=name, surname=surname, password=password)
        logger.info(user.__str__)
        create_user(user, db_connection)
        return {"success": True, "errors": str(error)}
    except Exception as error:
        logger.warning(str(error))
        return {"success": False, "errors": str(error)}  

@app.post("/post/create")
def post_create_post(post: Post):
    try:
        create_post(post, db_connection)
        return {"success": True, "errors": None}
    except Exception as error:
        logger.warning(str(error))
        return {"success": False, "errors": str(error)}

@app.post("/vehicle/create")
def post_create_vehicle(vehicle: Vehicle):
    try:
        create_vehicle(vehicle, db_connection)
        return {"success": True, "errors": None}
    except Exception as error:
        # Usar str(error) para una descripción más clara
        logger.warning(str(error))
        return {"success": False, "errors": str(error)}