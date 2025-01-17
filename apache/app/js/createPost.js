// Array para almacenar los vehículos

let vehicles = [];

let postInfo = {}; // Objeto para almacenar la información de la flota


// Botón para iniciar el proceso de agregar vehículos

document.getElementById('startAddingVehiclesBtn').addEventListener('click', function () {

    const title = document.getElementById('fleetTitle').value;

    const description = document.getElementById('fleetDescription').value;


    if (title && description) {

        // Almacenar la información de la flota

        postInfo = { title: title, description: description };


        // Ocultar el formulario de flota y mostrar el formulario de vehículos

        document.getElementById('fleetInfo').style.display = 'none';

        document.getElementById('vehicleFormSection').style.display = 'block';

        document.getElementById('uploadVehiclesBtn').style.display = 'inline-block'; // Mostrar botón para subir vehículos

    } else {

        alert("Por favor, ingrese un título y descripción para la flota.");

    }

});


// Botón para añadir vehículo

document.getElementById('addVehicleBtn').addEventListener('click', function () {

    try {

        const license_plate = document.getElementById('license_plate').value;

        const brand = document.getElementById('make').value;

        const model = document.getElementById('model').value;

        const year = document.getElementById('year').value;

        const price = document.getElementById('price').value;

        const description = document.getElementById('description').value;

        const vehicleType = document.getElementById('vehicleType').value;

        const fuelType = document.getElementById('fuelType').value;

        const photos = document.getElementById('photos').files;


        // Validar campos requeridos

        if (!license_plate || !brand || !model || !year || !price || !description || !vehicleType || !fuelType || photos.length === 0) {

            throw new Error("Por favor, complete todos los campos requeridos.");

        }


        // Crear el objeto del vehículo

        const vehicleItem = {

            license_plate,

            brand,

            model,

            year,

            price,

            description,

            vehicleType,

            fuelType,

            photos: []

        };


        // Procesar las fotos

        const readerPromises = [];

        for (const element of photos) {

            const reader = new FileReader();

            readerPromises.push(new Promise((resolve, reject) => {

                reader.onload = function (e) {

                    vehicleItem.photos.push(e.target.result);

                    resolve();

                };

                reader.onerror = reject;

                reader.readAsDataURL(element);

            }));

        }


        // Después de que todas las fotos se hayan cargado, agregar el vehículo a la flota

        Promise.all(readerPromises).then(() => {

            // Añadir el vehículo a la lista visual

            const vehicleList = document.getElementById('vehicleList');

            const vehicleDiv = document.createElement('div');

            vehicleDiv.classList.add('vehicle-item');


            let photoHTML = '';

            vehicleItem.photos.forEach(photo => {

                photoHTML += `<img src="${photo}" alt="Foto del vehículo" style="width: 100px; margin: 5px;">`;

            });


            vehicleDiv.innerHTML = `

                <h3>${vehicleItem.brand} ${vehicleItem.model} (${vehicleItem.year})</h3>

                <p>Precio: $${vehicleItem.price}</p>

                <p>${vehicleItem.description}</p>

                <p>Tipo de Vehículo: ${vehicleItem.vehicleType}</p>

                <p>Combustible: ${vehicleItem.fuelType}</p>

                <p>Matrícula: ${vehicleItem.license_plate}</p>

                <div>${photoHTML}</div>

            `;

            vehicleList.appendChild(vehicleDiv);


            // Añadir el vehículo al array de la flota

            vehicles.push(vehicleItem);


            // Limpiar el formulario

            document.getElementById('vehicleForm').reset();

        }).catch(err => {

            console.error('Error al cargar las fotos:', err);

            alert('Hubo un error al cargar las fotos.');

        });

    } catch (error) {

        alert(error.message);

    }

});


// Botón para subir todos los vehículos

document.getElementById('uploadVehiclesBtn').addEventListener('click', function () {

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

    const url = '/api/uploadVehicles';


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

            document.getElementById('fleetInfo').style.display = 'block';

            document.getElementById('vehicleFormSection').style.display = 'none';

        } else {

            alert('Hubo un problema al subir los vehículos.');

        }

    })

    .catch(error => {

        console.error('Error:', error);

        alert('Hubo un problema al subir los vehículos.');

    });

});