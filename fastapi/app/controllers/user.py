from models.user import User
from fastapi import HTTPException, status
from controllers.queries import create_user_query, login_query
from controllers.dbmanager import execute, execute_query
from utils import verify_hash
from datetime import datetime, timedelta, timezone
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
            
            expiration_time = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv("EXPIRATION_MINUTES")))
            payload = {
                "user_email": email,
                "exp": expiration_time
            }
            
            # Generar el token
            token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
                        
            return token
        else:
            raise Exception("Credentials could not be verified")
    else:
        raise Exception("User not found")
    
def verify_token(token: str) -> dict:
    """
    Verifica la validez del token, comprueba su expiración y decodifica el payload.
    Si el token es inválido o ha expirado, lanza una excepción HTTP.
    """
    try:
        # Decodificar el token usando la clave secreta
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        
        # Obtener la fecha de expiración desde el payload
        exp_timestamp = payload["exp"]
        
        # Convertir la fecha de expiración (timestamp) en un objeto datetime con zona horaria
        exp_datetime = datetime.utcfromtimestamp(exp_timestamp).replace(tzinfo=timezone.utc)
        
        # Obtener la hora actual con zona horaria
        current_datetime = datetime.now(timezone.utc)
        
        # Verificar que el token no ha expirado
        if current_datetime > exp_datetime:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
        
        return payload  # Retorna el payload si es válido
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        # Captura cualquier otro error inesperado y lanza una excepción genérica
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate token")