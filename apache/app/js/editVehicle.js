let license_plate = null
let photoPreviewData = null

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    license_plate = params.get('license_plate');
    verificarSesion();
    verificarAcceso(license_plate);
    loadVehicleData(license_plate);

    document.getElementById('updateVehiclesForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const formData = new FormData();
        formData.append('license_plate', document.getElementById('license_plate').value);
        formData.append('brand', document.getElementById('brand').value);
        formData.append('model', document.getElementById('model').value);
        formData.append('registration_year', document.getElementById('registration_year').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('observations', document.getElementById('observations').value);
        formData.append('vehicle_type', document.getElementById('vehicleType').value);
        formData.append('fuel_type', document.getElementById('fuelType').value);

        let photo = photoPreviewData;

        if (document.getElementById('photo').files.length > 0) {
            photo = document.getElementById('photo').files[0];
        }

        formData.append('photo', photo); // Ahora enviamos el archivo, no el base64

        // Enviar los vehículos a la API
        fetch('/api/vehicle/update', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    alert("Vehículo subido correctamente")
                    console.log("Vehicle uploaded successfully");
                } else {
                    alert("Hubo un problema al subir el vehículo.");
                    console.error("Error uploading vehicle.");
                    throw new Error('Hubo un problema al crear el post.');
                }
            })
            .catch(error => {
                alert("Hubo un problema de red.");
                console.error("Error de red:", error);
            });
    });
});

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


function loadVehicleData(license_plate) {
    fetch(`/api/vehicle/get?license_plate=${license_plate}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            const vehicle = data.vehicle;

            // Llenar los campos del formulario con los valores recuperados del servidor
            document.getElementById("license_plate").value = vehicle.license_plate;
            document.getElementById("brand").value = vehicle.brand;
            document.getElementById("model").value = vehicle.model;
            document.getElementById("registration_year").value = parseInt(vehicle.registration_year);
            document.getElementById("price").value = parseFloat(vehicle.iva).toFixed(2);
            document.getElementById("observations").value = vehicle.observations;

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
                photoPreviewData = vehicle.photo;
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