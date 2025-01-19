document.addEventListener("DOMContentLoaded", () => {
    const vehiclesContainer = document.getElementById("vehicles-container");

    // Define el `post_id` a consultar
    const postId = 1; // Cambia esto según sea necesario

    // URL con el parámetro de consulta
    const url = `http://localhost:8000/vehicle/post?post_id=${postId}`;

    // Realizar la solicitud al backend
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching vehicles: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const vehicles = data.vehicles;

            // Renderizar los vehículos en el contenedor
            vehiclesContainer.innerHTML = vehicles.map(vehicle => `
                <div class="vehicle">
                    <h2>${vehicle.brand} - ${vehicle.model}</h2>
                    <p><strong>Año:</strong> ${vehicle.registration_year}</p>
                    <p><strong>Precio:</strong> $${vehicle.price.toLocaleString()}</p>
                    <p><strong>Tipo:</strong> ${vehicle.vehicle_type}</p>
                    <p><strong>Combustible:</strong> ${vehicle.fuel_type}</p>
                    <p><strong>Observaciones:</strong> ${vehicle.observations}</p>
                    ${vehicle.photo ? `<img src="data:image/jpeg;base64,${vehicle.photo}" alt="${vehicle.model}" />` : ""}
                </div>
            `).join("");
        })
        .catch(error => {
            console.error(error);
            vehiclesContainer.innerHTML = `<p>Error al cargar vehículos.</p>`;
        });
});
