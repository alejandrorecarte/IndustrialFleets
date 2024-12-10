from fastapi import FastAPI
from controllers.vehicle import create_vehicle
from models.vehicle import Vehicle
from models.enums import VehicleType, FuelType
from dotenv import load_dotenv
from controllers.dbmanager import connect_to_db, close_connection
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

@app.get("/")
def read_root():
    return {"message": "Hola caracola"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.post("/vehicle/create")
def create_vehicle(vehicle: Vehicle):
    try:
        
        create_vehicle(vehicle, db_connection)
        return {"success": True, "errors": None}
    except Exception as error:
        return {"success": False, "errors": error.__repr__}
