from models.vehicle import Vehicle
from controllers.queries import create_vehicle_query, get_last_id
from controllers.dbmanager import execute, execute_query

def create_vehicle(vehicle: Vehicle, db_connection):

    query = create_vehicle_query()
    params = (vehicle.license_plate, vehicle.registration_year, vehicle.observations, vehicle.vehicle_type, vehicle.fuel_type, vehicle.photo, vehicle.post_id)
    
    execute(query, params, db_connection)
    
    return vehicle