from models.enums import FuelType, VehicleType
from typing import List
from pydantic import BaseModel

class Vehicle(BaseModel):
    license_plate: str
    registration_year: int
    observations: str
    vehicle_type: VehicleType
    fuel_type: FuelType
    photos: List[str]