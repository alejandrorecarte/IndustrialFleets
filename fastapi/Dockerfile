FROM python:3.10-slim

# 1. Crear un usuario no root
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 2. Crear el entorno virtual y asignarlo a appuser
RUN python -m venv /opt/venv \
 && chown -R appuser:appuser /opt/venv

# 3. Poner el venv en el PATH
ENV PATH="/opt/venv/bin:$PATH"

# 4. Establecer directorio de trabajo y permisos
WORKDIR /app
RUN mkdir -p /app \
 && chown appuser:appuser /app

# 5. Cambiar a appuser antes de copiar e instalar
USER appuser

# 6. Copiar requirements e instalar dependencias
COPY --chown=appuser:appuser fastapi/app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copiar el código fuente
COPY --chown=appuser:appuser fastapi/app/ .

# 8. Exponer el puerto y configurar PYTHONPATH
EXPOSE 8000
ENV PYTHONPATH=/app:$PYTHONPATH

# 9. Añadir HEALTHCHECK para Checkov
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl --fail http://localhost:8000/health || exit 1

# 10. Ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
