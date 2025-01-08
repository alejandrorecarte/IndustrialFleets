from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from controllers.vehicle import create_vehicle
from models.vehicle import Vehicle
from models.post import Post
from models.user import User
from dotenv import load_dotenv
from controllers.dbmanager import connect_to_db, close_connection
from controllers.user import create_user, login, verify_token
from controllers.post import create_post, update_post, delete_post, get_post, get_post_last, get_post_user, get_post_user_pages, get_post_last_pages
import os
import logging
import time

app = FastAPI()
security = HTTPBearer()

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
    
def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Función que extrae el token Bearer del encabezado Authorization.
    Si no se encuentra o es inválido, se lanza una excepción HTTP.
    """
    return verify_token(credentials.credentials)  # Devuelve el token (credentials.credentials)


@app.get("/secure-endpoint")
def secure_endpoint(token: str = Depends(get_token)):
    """
    Endpoint protegido que requiere el token Bearer en la cabecera.
    """
    return {"message": "Access granted", "token": token}

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

@app.post("/register", status_code=status.HTTP_201_CREATED)
def post_register(email: str, name: str, surname: str, password: str):
    try:
        user = User(email=email, name=name, surname=surname, password=password)
        create_user(user, db_connection)
        return {"user": {"email": email, "name" : name, "surname": surname}}
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )
    
@app.post("/login", status_code=status.HTTP_202_ACCEPTED)
def post_login(email: str, password:str):
    try:
        access_token = login(email= email, password=password, db_connection = db_connection)
        if access_token:
            return {"access_token": access_token}
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )

@app.post("/post/create", status_code=status.HTTP_201_CREATED)
def post_create_post(post: Post, token: str = Depends(get_token)):
    post.user_email = token["user_email"]
    try:
        post = create_post(post, db_connection)
        return {"post": post.model_dump()}
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )
        
@app.post("/post/update", status_code=status.HTTP_200_OK)
def post_update_post(post: Post, token: str = Depends(get_token)):
    user_email = token["user_email"]
    try:
        post = update_post(post, user_email, db_connection)
        return {"post": post.model_dump()}
    except HTTPException as error:
        logger.warning(str(error.detail))
        raise HTTPException(
                    status_code=error.status_code,
                    detail=error.detail 
                )
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )
        
@app.post("/post/delete", status_code=status.HTTP_200_OK)
def post_delete_post(post_id: int, token: str = Depends(get_token)):
    user_email = token["user_email"]
    try:
        delete_post(post_id, user_email, db_connection)
        return {}
    except HTTPException as error:
        logger.warning(str(error.detail))
        raise HTTPException(
                    status_code=error.status_code,
                    detail=error.detail 
                )
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )
        
@app.get("/post/get", status_code=status.HTTP_200_OK)
def get_post_by_id(post_id: int, token: str = Depends(get_token)):
    user_email = token["user_email"]
    try:
        post = get_post(post_id, user_email, db_connection=db_connection)
        return {"post": post}
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )
        
@app.get("/post/getuser", status_code=status.HTTP_200_OK)
def get_user_post(user_email: str, page: int, token: str = Depends(get_token)):
    try:
        posts = get_post_user(user_email, page, db_connection)
        posts_json = [post.model_dump() for post in posts]
        
        max_pages = get_post_user_pages(user_email, db_connection)
        return { "page": page, "max_pages": max_pages,"last_posts": posts_json }
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )
        
@app.get("/post/getlast", status_code=status.HTTP_200_OK)
def get_last_post(page: int, token: str = Depends(get_token)):
    try:
        posts = get_post_last(page, db_connection)
        posts_json = [post.model_dump() for post in posts]
        
        max_pages = get_post_last_pages(db_connection)
        return {"page": page, "max_pages": max_pages, "last_posts": posts_json}
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )

@app.post("/vehicle/create", status_code=status.HTTP_201_CREATED)
def post_create_vehicle(vehicle: Vehicle, token: str = Depends(get_token)):
    try:
        vehicle = create_vehicle(vehicle, db_connection)
        return {"vehicle": vehicle.model_dump()}
    except Exception as error:
        logger.warning(str(error))
        raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=str(error)
                )