let vehicle_id = null; // ID del vehículo que se editará
let post_id = null; // ID del post al que pertenece el vehículo

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    vehicle_id = parseInt(params.get('vehicle_id'));
    post_id = parseInt(params.get('post_id'));

    verificarSesion(); // Validar que el usuario esté autenticado
    verificarAcceso(post_id); // Validar acceso al post

    // Cargar datos del vehículo en el formulario
    if (vehicle_id) {
        loadVehicleData(vehicle_id);
    }

    // Evento para guardar cambios en el vehículo
    document.getElementById('vehicleEditForm').addEventListener('submit', function (event) {
        event.preventDefault();
        updateVehicle(vehicle_id);
    });

    // Botón de regreso al post relacionado
    document.getElementById('backButton').addEventListener('click', function () {
        window.location.href = `/img/editPost.html?post_id=${post_id}`;
    });

    // Acceso a la página de inicio desde el logo o título
    document.getElementById('homePageLogo').addEventListener('click', function () {
        window.location.href = '/img/home.html';
    });
    document.getElementById('homePageTitle').addEventListener('click', function () {
        window.location.href = '/img/home.html';
    });
});

// Verificar que el usuario esté autenticado
function verificarSesion() {
    const token = getCookie('access_token');
    if (!token) {
        window.location.href = '../index.html';
    } else {
        fetch('/api/secure-endpoint', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    window.location.href = '../index.html';
                }
            })
            .catch(error => console.error('Error al verificar la sesión:', error));
    }
}

// Verificar si el usuario tiene acceso al post
function verificarAcceso(post_id) {
    return fetch(`/api/post/access?post_id=${post_id}`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                window.location.href = '../index.html';
            }
            return true;
        })
        .catch(error => {
            console.error('Error al verificar el acceso al post:', error);
            window.location.href = '../index.html';
        });
}

// Obtener el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Cargar datos del vehículo a editar
function loadVehicleData(vehicle_id) {
    fetch(`/api/vehicle/${vehicle_id}`, { method: 'GET' })
        .then(response => response.json())
        .then(vehicle => {
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

// Actualizar los datos del vehículo
function updateVehicle(vehicle_id) {
    const license_plate = document.getElementById('license_plate').value.trim();
    const brand = document.getElementById('brand').value.trim();
    const model = document.getElementById('model').value.trim();
    const registration_year = document.getElementById('registration_year').value.trim();
    const price = document.getElementById('price').value.trim();
    const observations = document.getElementById('observations').value.trim();
    const vehicleType = document.getElementById('vehicleType').value.trim();
    const fuelType = document.getElementById('fuelType').value.trim();
    const photo = document.getElementById('photo').files[0];

    // Validar que los campos obligatorios estén completos
    if (!license_plate || !brand || !model || !registration_year || !price || !vehicleType || !fuelType) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }

    const formData = new FormData();
    formData.append('license_plate', license_plate);
    formData.append('brand', brand);
    formData.append('model', model);
    formData.append('registration_year', registration_year);
    formData.append('price', price);
    formData.append('observations', observations);
    formData.append('vehicleType', vehicleType);
    formData.append('fuelType', fuelType);
    if (photo) {
        formData.append('photo', photo);
    }

    fetch(`/api/vehicle/update/${vehicle_id}`, {
        method: 'PUT',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                alert('Vehículo actualizado correctamente.');
                window.location.href = `/img/editPost.html?post_id=${post_id}`;
            } else {
                throw new Error('Error al actualizar el vehículo.');
            }
        })
        .catch(error => console.error('Error al actualizar el vehículo:', error));
}
