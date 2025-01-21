from pydantic import BaseModel

class Post(BaseModel):
    post_id: int = None
    title: str
    description: str
    post_timestamp:int = None
    is_sold:bool = False
    user_email:str = None
    total_price:float = None
    iva:float = None