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


// Cargar datos del vehículo a editar
function loadVehicleData(license_plate) {
    fetch(`/api/vehicle/get?license_plate=${license_plate}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const vehicle=data.vehicle;
            document.getElementById('license_plate').value = vehicle.license_plate || '';
            document.getElementById('brand').value = vehicle.brand || '';
            document.getElementById('model').value = vehicle.model || '';
            document.getElementById('registration_year').value = vehicle.registration_year || '';
            document.getElementById('price').value = vehicle.price || '';
            document.getElementById('observations').value = vehicle.observations || '';
            document.getElementById('vehicleType').value = vehicle.vehicleType || '';
            document.getElementById('fuelType').value = vehicle.fuelType || '';
        })
        .catch(error => console.error('Error al cargar los datos del vehículo:', error));
}