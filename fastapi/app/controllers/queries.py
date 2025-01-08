def create_vehicle_query():
    return "INSERT INTO Vehicles (license_plate, registration_year, observations, vehicle_type, fuel_type, photo, post_id) VALUES (%s, %s, %s, %s, %s, %s, %s);"

def create_user_query():
    return "INSERT INTO Users (email, name, surname, hashed_password) VALUES (%s, %s, %s, %s);"

def login_query():
    return "SELECT * FROM Users WHERE email LIKE %s;"

# POSTS
def check_post_access_query():
    return "SELECT user_email FROM Posts WHERE post_id LIKE %s"

def create_post_query():
    return "INSERT INTO Posts (title, description, is_sold ,user_email) VALUES (%s, %s, %s, %s)"

def update_post_query():
    return "UPDATE Posts SET title = %s, description = %s, is_sold = %s WHERE post_id LIKE %s"

def delete_post_query():
    return "DELETE FROM Posts WHERE post_id LIKE %s"

def get_post_query():
    return "SELECT * FROM Posts WHERE post_id LIKE %s"

def get_post_user_query():
    return "SELECT * FROM Posts WHERE user_email LIKE %s ORDER BY post_timestamp DESC LIMIT %s OFFSET %s"

def get_post_user_pages_query():
    return "SELECT COUNT(*) FROM Posts WHERE user_email LIKE %s"

def get_post_last_query():
    return "SELECT * FROM Posts ORDER BY post_timestamp DESC LIMIT %s OFFSET %s"

def get_post_last_pages_query():
    return "SELECT COUNT(*) FROM Posts"

def get_last_id():
    return "SELECT LAST_INSERT_ID()"