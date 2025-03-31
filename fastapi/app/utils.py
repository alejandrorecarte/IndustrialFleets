import bcrypt
import jwt
import re
import os
import html
import bleach
from fastapi import HTTPException, status, Request
from datetime import datetime, timedelta, timezone
import datetime
from werkzeug.http import http_date

def hash(value):
    if value:
        salt = os.getenv("SALT")
        hashed = bcrypt.hashpw(value.encode("utf-8"), salt.encode("utf-8")).decode("utf-8")
        return hashed
    return None


def verify_hash(value, hashed_value):
    return bcrypt.checkpw(value.encode("utf-8"), hashed_value.encode("utf-8"))

def get_token_from_cookie(request: Request):
    """
    Esta función extrae el token de la cookie 'access_token'.
    Si no se encuentra o es inválido, lanza una excepción HTTP.
    """
    access_token = request.cookies.get("access_token")
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token not found"
        )
    return verify_token(access_token)

def verify_token(token: str) -> dict:
    """
    Verifica la validez del token, comprueba su expiración y decodifica el payload.
    Si el token es inválido o ha expirado, lanza una excepción HTTP.
    """
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        exp_timestamp = payload["exp"]
        exp_datetime = datetime.utcfromtimestamp(exp_timestamp).replace(tzinfo=timezone.utc)
        current_datetime = datetime.now(timezone.utc)
        if current_datetime > exp_datetime:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
        
        return payload
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate token")
    
def create_token(email: str):
    
        expiration_time = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv("EXPIRATION_MINUTES")))
        payload = {
            "user_email": email,
            "exp": expiration_time
        }
        return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
    
def calc_iva(price: float) -> float:
    return price * 0.21


def validate_password_strength(password):
    pattern = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    
    if re.match(pattern, password) and len(password) >= 8:
        return True
    else:
        return False
    

def validate_email(email):
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if re.match(pattern, email):
        return True
    else:
        return False
    
def sanitize_input(user_input):
 # Usamos bleach para eliminar etiquetas HTML no deseadas
 escaped_input = html.escape(user_input)
 return bleach.clean(escaped_input)

def prepare_response_extra_headers(include_security_headers):

    response_extra_headers = {
        # always
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': http_date(datetime.datetime.now()),
        'Server':''
    }
    if include_security_headers:
        response_security_headers = {
            # X-Frame-Options: page can only be shown in an iframe of the same site
            'X-Frame-Options': 'SAMEORIGIN',
            # ensure all app communication is sent over HTTPS
            'Strict-Transport-Security': 'max-age=63072000; includeSubdomains',
            # instructs the browser not to override the response content type
            'X-Content-Type-Options': 'nosniff',
            # enable browser cross-site scripting (XSS) filter
            'X-XSS-Protection': '1; mode=block'
        }
        response_extra_headers.update(response_security_headers)

    return response_extra_headers