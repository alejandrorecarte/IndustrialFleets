let license_plate = null

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    license_plate = params.get('license_plate');
    verificarSesion();
    verificarAcceso(license_plate);

    document.getElementById("backButton").addEventListener("click", function (event) {
        document.location.href = '/img/editPost.html';
    })
    document.getElementById("homePageLogo").addEventListener("click", function (event) {
        document.location.href = '/img/home.html';
    })
    document.getElementById("homePageTitle").addEventListener("click", function (event) {
        document.location.href = '/img/home.html';
    })
    loadVehicleData(license_plate);

    // Configurar el evento para el botón "Reemplazar imagen"
    document.getElementById("editVehiclePhotoButton").addEventListener("click", function () {
        document.getElementById("photo").click(); // Simula un clic en el input tipo file
    });

    // Guardar los cambios al hacer clic en el botón "Guardar cambios"
    document.getElementById("addVehicleBtn").addEventListener("click", saveVehicleChanges);
})

// Obtener el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function verificarAcceso(license_plate) {
    fetch('/api/vehicle/access?license_plate=' + license_plate, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                // Si la respuesta es OK (status 200), el token es válido
                console.log("Vehicle access verified")
            } else {
                // Si la respuesta no es OK (por ejemplo, token inválido o expirado), mostrar los botones de login
                console.log("Vehicle access not verified")
                window.location.href = '../index.html';
            }
        })
        .catch(error => {
            alert("Hubo un problema de red.");
            window.close();
        });
}

// Verificar si el usuario está autenticado
function verificarSesion() {
    const token = getCookie('access_token'); // Obtener el token de la cookie

    if (token === null) {
        window.location.href = '../index.html';
        console.log("No cookies")
    }
    else {
        console.log("Verifying cookie")
        fetch('/api/secure-endpoint', {
            method: 'GET'
        })
            .then(response => {
                if (response.ok) {
                    // Si la respuesta es OK (status 200), el token es válido
                    console.log("Cookie verified")
                } else {
                    // Si la respuesta no es OK (por ejemplo, token inválido o expirado), mostrar los botones de login
                    console.log("Cookie not verified")
                    window.location.href = '../index.html?back_url=/img/createPost.html';
                }
            })
            .catch(error => {
                console.error('Error al verificar la sesión:', error);
            });
    }
}


/*function loadPage(license_plate) {
    // Obtener el formulario y agregar el evento de submit para la edición de la flota
    document.getElementById('postForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Recoger los datos del formulario
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        // Validar que los campos no estén vacíos
        if (!title || !description) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Crear el objeto de parámetros
        postInfo = { title, description };
    });
}*/


function loadVehicleData(license_plate) {
    fetch(`/api/vehicle/get?license_plate=${license_plate}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            const vehicle = data.vehicle;

            // Llenar los campos del formulario con los valores recuperados del servidor
            document.getElementById("license_plate").value = vehicle.license_plate || "";
            document.getElementById("brand").value = vehicle.brand || "";
            document.getElementById("model").value = vehicle.model || "";
            document.getElementById("registration_year").value = vehicle.registration_year || "";
            document.getElementById("price").value = vehicle.price || "";
            document.getElementById("observations").value = vehicle.observations || "";

            // Seleccionar el tipo de vehículo en el desplegable
            const vehicleTypeSelect = document.getElementById("vehicleType");
            for (let i = 0; i < vehicleTypeSelect.options.length; i++) {
                if (vehicleTypeSelect.options[i].value === vehicle.vehicle_type) {
                    vehicleTypeSelect.selectedIndex = i;
                    break;
                }
            }

            // Seleccionar el tipo de combustible en el desplegable
            const fuelTypeSelect = document.getElementById("fuelType");
            for (let i = 0; i < fuelTypeSelect.options.length; i++) {
                if (fuelTypeSelect.options[i].value === vehicle.fuel_type) {
                    fuelTypeSelect.selectedIndex = i;
                    break;
                }
            }

           // Mostrar la imagen actual si existe
           if (vehicle.photo) {
                const photoPreview = document.getElementById("photoPreview");
                photoPreview.src = `data:image/png;base64,${vehicle.photo}`;
                photoPreview.style.display = "block";
            }
        })
        .catch(error => console.error("Error al cargar los datos del vehículo:", error));
}


// Manejador para la vista previa de la imagen
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const photoPreview = document.getElementById("photoPreview");
            photoPreview.src = e.target.result;
            photoPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}


// Función para eliminar la foto del vehículo
function deleteVehiclePhoto() {
    const photoPreview = document.getElementById("photoPreview");
    const deleteButton = document.getElementById("deletePhotoBtn");

    // Eliminar la imagen de la vista previa
    photoPreview.src = "";
    photoPreview.style.display = "none";

    // Ocultar el botón de eliminar foto
    deleteButton.style.display = "none";
}

function saveVehicleChanges() {
    const license_plate = document.getElementById("license_plate").value.trim();
    const brand = document.getElementById("brand").value.trim();
    const model = document.getElementById("model").value.trim();
    const registration_year = document.getElementById("registration_year").value.trim();
    const price = parseFloat(document.getElementById("price").value.trim());
    const observations = document.getElementById("observations").value.trim();
    const vehicleType = document.getElementById("vehicleType").value.trim();
    const fuelType = document.getElementById("fuelType").value.trim();
    const photoInput = document.getElementById("photo");

    // Validar campos obligatorios
    if (!license_plate || !brand || !model || !registration_year || isNaN(price)) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    const vehicleData = {
        license_plate,
        brand,
        model,
        registration_year: parseInt(registration_year),
        price,
        observations,
        vehicle_type: vehicleType,
        fuel_type: fuelType,
    };

    // Adjuntar imagen si se seleccionó una nueva
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            vehicleData.photo = e.target.result.split(',')[1]; // Convertir a base64
            sendUpdateRequest(vehicleData);
        };
        reader.readAsDataURL(file);
    } else {
        // Si no se seleccionó una nueva imagen, enviar la foto actual (si existe) o null
        vehicleData.photo = (document.getElementById("photoPreview").src) ? document.getElementById("photoPreview").src.split(',')[1] : null;
        sendUpdateRequest(vehicleData);
    }
}

// Enviar la solicitud de actualización
function sendUpdateRequest(vehicleData) {
    fetch('/api/vehicle/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Vehículo actualizado correctamente.');
            window.location.href = '/img/home.html'; // Redirigir al inicio después de actualizar
        } else {
            alert('Error al actualizar el vehículo: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al actualizar el vehículo:', error);
        alert('Error al actualizar el vehículo. Consulte la consola para más detalles.');
    });
}

