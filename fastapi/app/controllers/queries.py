def create_vehicle_query():
    return "INSERT INTO Vehicles (license_plate, registration_year, observations, vehicle_type, fuel_type, photo, post_id) VALUES (%s, %s, %s, %s, %s, %s, %s);"

def create_user_query():
    return "INSERT INTO Users (email, name, surname, hashed_password) VALUES (%s, %s, %s, %s);"

def login_query():
    return "SELECT * FROM Users WHERE email LIKE %s;"

def create_post_query():
    return "INSERT INTO Posts (title, description, is_sold ,user_email) VALUES (%s, %s, %s, %s)"

def get_last_id():
    return "SELECT LAST_INSERT_ID()"