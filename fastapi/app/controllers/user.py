from models.user import User
from fastapi import HTTPException
from controllers.queries import create_user_query, login_query, create_access_token, delete_access_token_if_exists
from controllers.dbmanager import execute, execute_query
from utils import verify_hash
import datetime
import os
import jwt

def create_user(user: User, db_connection):

    query = create_user_query()
    params = (user.email, user.name, user.surname, user.hashed_password)
    
    execute(query, params, db_connection)
    
def login(email: str, password: str, db_connection):
    params = (email)
    # Ejecutar la consulta
    users = execute_query(login_query(), params, db_connection)
    
    if users:
        if verify_hash(password, users[0][3]):
            params = (email)
            
            try:
                execute(delete_access_token_if_exists(), params, db_connection)
            except Exception as error:
                raise Exception(str(error))
            
            expiration_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=int(os.getenv("EXPIRATION_MINUTES")))
            payload = {
                "user_email": email,
                "exp": expiration_time
            }
            
            # Generar el token
            token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
            params = (token, email, expiration_time)
            
            execute(create_access_token(), params, db_connection)
            
            return token
        else:
            raise Exception("Credentials could not be verified")
    else:
        raise Exception("User not found")
    
def verify_token(token: str):
    try:
        # Decodificar el token usando la clave secreta
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        
        # Verificar que el token no ha expirado
        if datetime.utcnow() > datetime.utcfromtimestamp(payload["exp"]):
            raise HTTPException(status_code=401, detail="Token has expired")
        
        return payload  # Retorna el payload si es válido
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")   