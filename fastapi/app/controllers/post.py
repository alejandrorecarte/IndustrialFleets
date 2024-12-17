from models.post import Post
from controllers.queries import create_post_query, get_last_id
from controllers.dbmanager import execute_query, execute
from models.user import User

def create_post(post: Post, db_connection) -> Post:

    query = create_post_query()
    params = (post.title, post.description, post.is_sold, post.user_email)
    
    execute(query, params, db_connection)
    
    query = get_last_id()
    params = ()
    results = execute_query(query, params, db_connection)
    
    if results:
        post.post_id = results[0][0]
        return post
    else:
        raise Exception("Could not create the post into BBDD")