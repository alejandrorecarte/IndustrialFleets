document.getElementById('addVehicleBtn').addEventListener('click', function() {
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const photos = document.getElementById('photos').files;

    const vehicleList = document.getElementById('vehicleList');
    const vehicleItem = document.createElement('div');
    vehicleItem.classList.add('vehicle-item');

    let photoHTML = '';
    for (let i = 0; i < photos.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoHTML += `<img src="${e.target.result}" alt="Foto del vehículo" style="width: 100px; margin: 5px;">`;
            if (i === photos.length - 1) {
                vehicleItem.innerHTML = `
                    <h3>${make} ${model} (${year})</h3>
                    <p>Precio: $${price}</p>
                    <p>${description}</p>
                    <div>${photoHTML}</div>
                `;
                vehicleList.appendChild(vehicleItem);
            }
        }
        reader.readAsDataURL(photos[i]);
    }

    // Limpiar el formulario
    document.getElementById('vehicleForm').reset();
});