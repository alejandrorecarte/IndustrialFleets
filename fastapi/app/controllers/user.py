from models.user import User
from controllers.queries import create_user_query
from controllers.dbmanager import execute_query

def create_user(user: User, db_connection):

    query = create_user_query()
    params = (user.email, user.name, user.surname, user.hashed_password)
    
    execute_query(query, params, db_connection)