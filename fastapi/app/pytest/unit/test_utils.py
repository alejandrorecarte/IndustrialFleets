from utils import calc_iva, validate_email, validate_password_strength

def test_calc_iva():
    assert calc_iva(100) == 21

def test_validate_email():
    assert validate_email("test@test.com") == True
    assert validate_email("test@test") == False
    assert validate_email("test.com") == False
    
def test_validate_password_strength():
    assert validate_password_strength("Test123@") == True
    assert validate_password_strength("test123@" ) == False
    assert validate_password_strength("Test1234") == False
    assert validate_password_strength("Test@") == False
    assert validate_password_strength("Test12@") == False