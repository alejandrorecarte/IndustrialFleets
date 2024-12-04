from vehicle import Vehicle
from typing import List

class Post:
    def __init__(self, id_anuncio: int, title: str, description: str, vehicles: List[Vehicle]):
        self.id_anuncio = id_anuncio
        self.title = title
        self.description = description
        self.vehicles = vehicles