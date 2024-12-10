from models.vehicle import Vehicle
import configparser
from controllers.dbmanager import execute_query

def create_vehicle(vehicle: Vehicle, db_connection):
    config = configparser.ConfigParser()
    config .read('queries.conf')
    query = config.get("vehicles", "create")
    params = (vehicle.license_plate, vehicle.registration_year, vehicle.observations, vehicle.vehicle_type, vehicle.fuel_type, vehicle.photo, vehicle.post_id)
    
    execute_query(query, params, db_connection)