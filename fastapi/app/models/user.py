from pydantic import BaseModel, root_validator
import bcrypt

class User(BaseModel):
    email: str
    name: str
    surname: str
    password: str
    hashed_password: str = None  # Este atributo será generado automáticamente

    # Usamos un root_validator para asegurarnos de que se pueda acceder al hash de la contraseña
    @root_validator(pre=True)
    def hash_password(cls, values):
        password = values.get('password')
        if password:
            # Generamos el hash de la contraseña utilizando bcrypt
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            values['hashed_password'] = hashed
        return values
