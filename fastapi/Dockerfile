# Usa la imagen oficial de Python como base
FROM python:3.10-slim

# Establece el directorio de trabajo
WORKDIR /fastapi/app

# Copia el archivo requirements.txt a la carpeta de trabajo
COPY fastapi/app/requirements.txt /fastapi/app/

# Crea un entorno virtual
RUN python -m venv /opt/venv

# Asegúrate de que el entorno virtual se active y las dependencias se instalen en él
RUN /opt/venv/bin/pip install --no-cache-dir -r /fastapi/app/requirements.txt

# Copia todo el contenido de la carpeta 'app' al contenedor
COPY fastapi/app/ /fastapi/app/

# Expone el puerto en el que FastAPI estará corriendo
EXPOSE 8000

# Establece el PYTHONPATH para que apunte a tu directorio de trabajo
ENV PYTHONPATH=/fastapi/app:$PYTHONPATH

# Activamos el entorno virtual al momento de ejecutar el contenedor
CMD ["/opt/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
