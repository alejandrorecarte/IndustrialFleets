from fastapi import FastAPI, Depends, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from api.user import router as user_router
from api.post import router as post_router
from api.vehicle import router as vehicle_router
from database import close_connection
import logging
from database import get_db_connection
from utils import get_token_from_cookie

app = FastAPI()

app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(post_router, prefix="/post", tags=["Posts"])
app.include_router(vehicle_router, prefix="/vehicle", tags=["Vehicles"])


load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Permitir solicitudes desde el frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

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

@app.on_event("startup")
async def startup_event():
    """Evento que se ejecuta al iniciar la aplicación"""
    logger.info("Application started")

@app.on_event("shutdown")
async def shutdown_event():
    """Cerrar la conexión a la base de datos al apagar la aplicación"""
    db_connection = await get_db_connection()

    if db_connection:
        close_connection(db_connection)

# Endpoint protegido que obtiene el token desde las cookies
@app.get("/secure-endpoint")
def secure_endpoint(request: Request, token: str = Depends(get_token_from_cookie)):
    """
    Endpoint protegido que requiere el token desde las cookies.
    """
    return {"message": "Access granted", "token": token}