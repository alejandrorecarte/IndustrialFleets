from models.post import Post
from controllers.queries import create_vehicle_query
from controllers.dbmanager import execute_query

def create_vehicle(vehicle: Vehicle, db_connection):

    query = create_vehicle_query()
    params = (vehicle.license_plate, vehicle.registration_year, vehicle.observations, vehicle.vehicle_type, vehicle.fuel_type, vehicle.photo, vehicle.post_id)
    
    execute_query(query, params, db_connection)