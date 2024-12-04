from models.vehicle import Vehicle
import configparser

def create_vehicle(vehicle: Vehicle):
    config = configparser.ConfigParser()
    config.read('constants.conf')
    max_photos = config.get("vehicles", "max_photos")
    if len(vehicle.photos) > max_photos:
        raise Exception(f"More than {max_photos} is not allowed.")
        