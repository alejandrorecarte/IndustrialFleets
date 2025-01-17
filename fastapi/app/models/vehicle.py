from enum import Enum
from pydantic import BaseModel
from typing import Optional
from io import BytesIO
import os

class FuelType(Enum):
    GASOLINE = "Gasolina"
    DIESEL = "Diésel"
    ELECTRIC = "Eléctrico"
    HYBRID = "Híbrido"

class VehicleType(Enum):
    CAR = "Coche"
    TRUCK = "Camión"
    MOTORCYCLE = "Motocicleta"
    BUS = "Bus"
    FORK_LIFT = "Carretilla elevadora"
    CRANE_TRUCK = "Camión con grúa"
    CEMENT_TRUCK = "Camión de cemento"
    TBM = "Tuneladora"

# Modelo de vehículo con Pydantic
class Vehicle(BaseModel):
    license_plate: str
    brand: str
    model: str
    registration_year: int
    price: float
    observations: str
    vehicle_type: VehicleType
    fuel_type: FuelType
    photo: Optional[bytes]
    post_id: int

