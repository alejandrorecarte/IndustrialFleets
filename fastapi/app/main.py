import os
import logging
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from fastapi_csrf_protect import CsrfProtect
from pydantic import BaseModel

from api.user import router as user_router
from api.post import router as post_router
from api.vehicle import router as vehicle_router
from database import close_connection, get_db_connection
from utils import get_token_from_cookie, prepare_response_extra_headers

# Configuración de variables de entorno
CONNECTION_TRIES = os.getenv("CONNECTION_TRIES")
EXPIRATION_MINUTES = os.getenv("EXPIRATION_MINUTES")
SECRET_KEY = os.getenv("SECRET_KEY")
PAGE_SIZE = os.getenv("PAGE_SIZE")
MAX_IMAGE_SIZE = os.getenv("MAX_IMAGE_SIZE")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Configuración para CSRF con fastapi-csrf-protect
class CsrfSettings(BaseModel):
    secret_key: str = SECRET_KEY  # Asegúrate de que SECRET_KEY esté definido

@CsrfProtect.load_config
def get_csrf_config():
    return CsrfSettings()

app = FastAPI()

# Middleware para CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para CSRF
@app.middleware("http")
async def csrf_middleware(request: Request, call_next):
    # Aplicar CSRF en métodos que modifican datos
    if request.method not in ("GET", "HEAD", "OPTIONS"):
        # Excluir endpoints de login y register
        if not (request.url.path.startswith("/login") or request.url.path.startswith("/register")):
            csrf_protect = CsrfProtect()
            csrf_token = request.headers.get("X-CSRF-Token")
            try:
                csrf_protect.validate_csrf(csrf_token)
            except Exception as e:
                return JSONResponse(status_code=403, content={"detail": "CSRF token missing or invalid"})
    response = await call_next(request)
    return response

# Incluir routers para endpoints
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(post_router, prefix="/post", tags=["Posts"])
app.include_router(vehicle_router, prefix="/vehicle", tags=["Vehicles"])

if os.getenv("DEBUG", "False") == "True":
    debug_level = logging.DEBUG
else:
    debug_level = logging.INFO

logging.basicConfig(
    level=debug_level,
    format='%(levelname)s - %(name)s - %(asctime)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# Cabeceras adicionales
extra_headers = prepare_response_extra_headers(True)

@app.on_event("startup")
async def startup_event():
    logger.info("Application started")

@app.on_event("shutdown")
async def shutdown_event():
    db_connection = await get_db_connection()
    if db_connection:
        close_connection(db_connection)

@app.get("/secure-endpoint")
def secure_endpoint(request: Request, token: str = Depends(get_token_from_cookie)):
    return {"message": "Access granted", "token": token}
