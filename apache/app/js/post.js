let vehicles = [];
let post_id = null;

window.onload = function () {
    verificarSesion();
    const params = new URLSearchParams(window.location.search);
    post_id = parseInt(params.get('post_id'));
    loadPost(post_id);
}

// Obtener el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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
                    window.location.href = '../index.html?back_url=/img/post.html?post_id='+post_id;
                }
            })
            .catch(error => {
                console.error('Error al verificar la sesión:', error);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("backButton").addEventListener("click", function (event) {
        document.location.href = '/img/home.html';
    })
    document.getElementById("homePageLogo").addEventListener("click", function (event) {
        document.location.href = '/img/home.html';
    })
    document.getElementById("homePageTitle").addEventListener("click", function (event) {
        document.location.href = '/img/home.html';
    })
})

function loadPost(post_id) {
    fetch(`/api/post/get?post_id=${post_id}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.post) {
                const post = data.post;
                document.getElementById('postTitle').innerText = post.title;
                document.getElementById('postDescription').innerText = post.description;
                // Suponiendo que el timestamp es el de tu objeto post
                let timestamp = post.post_timestamp*1000;  // Ejemplo: 1674243600000

                // Crear un objeto Date a partir del timestamp
                let date = new Date(timestamp);

                // Obtener los componentes de la fecha
                let year = date.getFullYear();
                let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes (con formato de 2 dígitos)
                let day = date.getDate().toString().padStart(2, '0'); // Día (con formato de 2 dígitos)
                let hours = date.getHours().toString().padStart(2, '0'); // Hora (con formato de 2 dígitos)
                let minutes = date.getMinutes().toString().padStart(2, '0'); // Minutos (con formato de 2 dígitos)

                // Formatear la fecha al formato que requiere el input datetime-local
                let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

                // Asignar la fecha formateada al campo input
                document.getElementById('postCreatedAt').value = formattedDate;
                document.getElementById('postTotalPrice').value = post.total_price.toFixed(2) + "€";
                document.getElementById('postIva').value = post.iva.toFixed(2) + "€ (21%)";

                fetch(`/api/vehicle/post?post_id=${post_id}`, {
                    method: 'GET'
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data.vehicles) {
                            vehicles = data.vehicles;
                            for (let vehicle of vehicles) {
                                addVehicleToList(vehicle);
                            }

                        } else {
                            console.error('Error: data.post is not an object');
                        }
                    })
            } else {
                console.error('Error: data.post is not an object');
            }
        })
}

const fuelTypeMapping = {
    "GASOLINE": "Gasolina",
    "DIESEL": "Diésel",
    "ELECTRIC": "Eléctrico",
    "HYBRID": "Híbrido"
};

const vehicleTypeMapping = {
    "CAR": "Coche",
    "MOTORCYCLE": "Motocicleta",
    "TRUCK": "Camión",
    "BUS": "Autobús",
    "FORK_LIFT": "Toro mecánico",
    "CRANE_TRUCK": "Grúa",
    "CEMENT_TRUCK": "Camión de cemento",
    "TBM": "Tuneladora"
};

function addVehicleToList(vehicleItem) {
    const vehicleList = document.getElementById('vehicleList');
    const vehicleDiv = document.createElement('div');
    vehicleDiv.classList.add('vehicle-item');

    if (!vehicleItem.photo) {
        console.log("No photo available for this vehicle"); // Si no hay foto, muestra un mensaje
        return;
    }

    // Asegurarse de que vehicleItem.photo esté correctamente formateado para base64
    const imageBase64 = `data:image/png;base64,${vehicleItem.photo}`;
    const vehicleType = vehicleTypeMapping[vehicleItem.vehicle_type.toString()] || vehicleItem.vehicle_type.toString();
    const fuelType = fuelTypeMapping[vehicleItem.fuel_type.toString()] || vehicleItem.fuel_type.toString()

    // Creamos el contenido HTML para el vehículo
    vehicleDiv.innerHTML = `
        <h3>${vehicleItem.brand} ${vehicleItem.model} (${vehicleItem.registration_year})</h3>
        <p>Precio: $${vehicleItem.price}</p>
        <p>${vehicleItem.observations}</p>
        <p>Tipo de Vehículo: ${vehicleType}</p>
        <p>Combustible: ${fuelType}</p>
        <p>Matrícula: ${vehicleItem.license_plate}</p>
        <img src="${imageBase64}" alt="Foto del vehículo" style="width: 100px; margin: 5px;">
    `;

    vehicleList.appendChild(vehicleDiv);
}

