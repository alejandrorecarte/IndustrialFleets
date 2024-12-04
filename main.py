from typing import List
from fastapi import FastAPI
from controllers.vehicle import create_vehicle
from models.vehicle import Vehicle
from models.enums import VehicleType, FuelType
from dotenv import load_dotenv
import os

load_dotenv()

debug_mode = os.getenv("DEBUG")

print(f"Debug Mode: {debug_mode}")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Marica"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.post("/vehicle/")
def create_vehicle(vehicle: Vehicle):
    try:
        create_vehicle(vehicle)
        return {"success": True, "errors" : None}
    except Exception as error:
        return {"success": False, "errors": error.__repr__}