// Obtener el formulario y agregar el evento de submit para la creación de la flota
document.getElementById('fleetForm').addEventListener('submit', function(event) {
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
    const params = { title, description };

    // Construir la URL con los parámetros codificados
    const url = `/api/post/create/?${new URLSearchParams(params).toString()}`;

    // Enviar los datos al backend
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    })
        .then(response => {
            if (response.ok) {
                alert('Flota creada con éxito.');
                document.getElementById('vehicleFormSection').style.display = 'block';
                document.getElementById('uploadVehiclesForm').style.display = 'block'; // Mostrar el formulario para subir vehículos
                return response.json();
            } else {
                throw new Error('Error al crear la flota.');
            }
        })
        .then(data => {
            window.fleetId = data.id; // Guardar el ID de la flota si es necesario
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al crear la flota.');
        });
});

// Inicializa el array de vehículos y el objeto de información de la flota
let vehicles = [];
let postInfo = {}; // Asegúrate de que postInfo contenga la información necesaria

// Botón para añadir vehículo
document.getElementById('addVehicleBtn').addEventListener('click', function () {
    try {
        const license_plate = document.getElementById('license_plate').value;
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const registration_year = document.getElementById('registration_year').value;
        const price = document.getElementById('price').value;
        const observations = document.getElementById('observations').value;
        const vehicleType = document.getElementById('vehicleType').value;
        const fuelType = document.getElementById('fuelType').value;
        const photo = document.getElementById('photo').files[0]; // Solo un archivo

        // Validar campos requeridos
        if (!license_plate || !brand || !model || !registration_year || !price || !observations || !vehicleType || !fuelType || !photo) {
            throw new Error("Por favor, complete todos los campos requeridos.");
        }

        // Crear el objeto del vehículo
        const vehicleItem = {
            license_plate,
            brand,
            model,
            registration_year,
            price,
            observations,
            vehicleType,
            fuelType,
            photo: null // Inicialmente, la foto será null
        };

        // Procesar la foto
        const reader = new FileReader();
        reader.onload = function (e) {
            vehicleItem.photo = e.target.result; // Guardar la imagen en base64
            addVehicleToList(vehicleItem); // Añadir el vehículo a la lista visual
        };
        reader.readAsDataURL(photo); // Leer la imagen como Data URL

    } catch (error) {
        alert(error.message);
    }
});

// Función para añadir el vehículo a la lista visual
function addVehicleToList(vehicleItem) {
    const vehicleList = document.getElementById('vehicleList');
    const vehicleDiv = document.createElement('div');
    vehicleDiv.classList.add('vehicle-item');

    vehicleDiv.innerHTML = `
        <h3>${vehicleItem.brand} ${vehicleItem.model} (${vehicleItem.registration_year})</h3>
        <p>Precio: $${vehicleItem.price}</p>
        <p>${vehicleItem.observations}</p>
        <p>Tipo de Vehículo: ${vehicleItem.vehicleType}</p>
        <p>Combustible: ${vehicleItem.fuelType}</p>
        <p>Matrícula: ${vehicleItem.license_plate}</p>
        <img src="${vehicleItem.photo}" alt="Foto del vehículo" style="width: 100px; margin: 5px;">
    `;

    vehicleList.appendChild(vehicleDiv);
    vehicles.push(vehicleItem); // Añadir el vehículo al array de la flota

    // Limpiar el formulario
    document.getElementById('vehicleForm').reset();
}

// Obtener el formulario y agregar el evento de submit para subir vehículos
document.getElementById('uploadVehiclesForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    if (vehicles.length === 0) {
        alert("No hay vehículos para subir.");
        return;
    }

    // Combinar la información de la flota con los vehículos
    const fleetData = {
        ...postInfo,
        vehicles: vehicles
    };

    // Construir la URL para la subida de vehículos
    const url = '/api/vehicle/create';

    // Enviar los datos al backend
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fleetData)
    })
    .then(response => {
        if (response.ok) {
            alert('Vehículos subidos exitosamente.');
            // Limpiar la lista de vehículos y la información de la flota
            vehicles = [];
            postInfo = {};
            document.getElementById('vehicleList').innerHTML = '';
            window.location.href = 'createFleet.html'; // Redirigir a la página de creación de flota
        } else {
            throw new Error('Hubo un problema al subir los vehículos.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al subir los vehículos.');
    });
});
