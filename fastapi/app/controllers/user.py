from models.user import User
from controllers.queries import create_user_query, login_query
from controllers.dbmanager import execute, execute_query
from utils import verify_hash

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
            return "123ABC"
        
        else:
            raise Exception("Credentials could not be verified")
    else:
        raise Exception("User not found")