from models.post import Post
from controllers.queries import create_post_query
from controllers.dbmanager import execute

def create_post(post: Post, db_connection):

    query = create_post_query()
    params = ()
    
    execute(query, params, db_connection)