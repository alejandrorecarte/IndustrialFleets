from enum import Enum
from pydantic import BaseModel

class FuelType(Enum):
    GASOLINE = "Gasoline"
    DIESEL = "Diesel"
    ELECTRIC = "Electric"
    HYBRID = "Hybrid"

class VehicleType(Enum):
    CAR = "Car"
    TRUCK = "Truck"
    MOTORCYCLE = "Motorcycle"
    BUS = "Bus"

# Modelo de vehículo con Pydantic
class Vehicle(BaseModel):
    license_plate: str
    registration_year: int
    observations: str
    vehicle_type: VehicleType
    fuel_type: FuelType
    photo: str
    post_id: int

