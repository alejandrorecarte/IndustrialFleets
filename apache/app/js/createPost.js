// Array para almacenar los vehículos
let vehicles = [];
let fleetInfo = {}; // Objeto para almacenar la información de la flota

// Botón para iniciar el proceso de agregar vehículos
document.getElementById('startAddingVehiclesBtn').addEventListener('click', function() {
    const fleetTitle = document.getElementById('fleetTitle').value;
    const fleetDescription = document.getElementById('fleetDescription').value;

    if (fleetTitle && fleetDescription) {
        // Almacenar la información de la flota
        fleetInfo = { title: fleetTitle, description: fleetDescription };

        // Ocultar el formulario de flota y mostrar el formulario de vehículos
        document.getElementById('fleetInfo').style.display = 'none';
        document.getElementById('vehicleFormSection').style.display = 'block';
        document.getElementById('uploadVehiclesBtn').style.display = 'inline-block'; // Mostrar botón para subir vehículos
    } else {
        alert("Por favor, ingrese un título y descripción para la flota.");
    }
});

// Botón para añadir vehículo
document.getElementById('addVehicleBtn').addEventListener('click', function() {
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const fuelType = document.getElementById('fuelType').value;
    const photos = document.getElementById('photos').files;

    // Crear el objeto del vehículo
    const vehicleItem = {
        make,
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
            reader.onload = function(e) {
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
            <h3>${vehicleItem.make} ${vehicleItem.model} (${vehicleItem.year})</h3>
            <p>Precio: $${vehicleItem.price}</p>
            <p>${vehicleItem.description}</p>
            <p>Tipo de Vehículo: ${vehicleItem.vehicleType}</p>
            <p>Combustible: ${vehicleItem.fuelType}</p>
            <div>${photoHTML}</div>
        `;
        vehicleList.appendChild(vehicleDiv);

        // Añadir el vehículo al array de la flota
        vehicles.push(vehicleItem);

        // Limpiar el formulario
        document.getElementById('vehicleForm').reset();
    }).catch(err => {
        console.error('Error al cargar las fotos:', err);
    });
});

// Botón para subir todos los vehículos
document.getElementById('uploadVehiclesBtn').addEventListener('click', function() {
    // Combinar la información de la flota con los vehículos
    const fleetData = {
        ...fleetInfo,
        vehicles: vehicles
    };

    // Simular el envío de datos (por ejemplo, a una API)
    console.log('Enviando la flota:', fleetData);

    // Aquí puedes hacer un POST real con fetch o axios
    /*
    fetch('/api/submitFleet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fleetData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Flota enviada con éxito');
    })
    .catch((error) => {
        console.error('Error al enviar la flota:', error);
    });
    */
});
