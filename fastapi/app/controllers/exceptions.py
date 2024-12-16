class DbException(Exception):
    def __init__(self, message: str):
        # Llamamos al constructor de la clase base (Exception)
        super().__init__(message)
        self.message = message