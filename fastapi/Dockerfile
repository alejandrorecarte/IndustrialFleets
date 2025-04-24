FROM python:3.10-slim

# Crea y usa un entorno virtual
RUN python -m venv /opt/venv

# Añade el binario del venv al PATH
ENV PATH="/opt/venv/bin:$PATH"

# Establece el directorio de trabajo
WORKDIR /app

# Copia requirements.txt (ajustado según dónde se ejecute el build)
COPY fastapi/app/requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el código fuente
COPY fastapi/app/ .

# Expone el puerto
EXPOSE 8000

# Asegura que Python pueda encontrar los módulos
ENV PYTHONPATH=/app:$PYTHONPATH

# Ejecuta la app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
