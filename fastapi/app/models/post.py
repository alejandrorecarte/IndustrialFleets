from pydantic import BaseModel

class Post(BaseModel):
    id_anuncio: int
    title: str
    description: str
    post_timestamp:int
    user_email:str