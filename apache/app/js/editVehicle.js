let post_id = null

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    post_id = parseInt(params.get('post_id'));
    verificarSesion();
    verificarAcceso(post_id);
    
    document.getElementById("backButton").addEventListener("click", function (event) {
        document.location.href = '/img/editPost.html';
    })
    document.getElementById("homePageLogo").addEventListener("click", function (event) {
        document.location.href = '/img/home.html';
    })
    document.getElementById("homePageTitle").addEventListener("click", function (event) {
        document.location.href = '/img/home.html';
    })
    loadPage(post_id);

})

// Obtener el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function verificarAcceso(post_id) {
    fetch('/api/post/access?post_id='+ post_id, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                // Si la respuesta es OK (status 200), el token es válido
                console.log("Post access verified")
            } else {
                // Si la respuesta no es OK (por ejemplo, token inválido o expirado), mostrar los botones de login
                console.log("Post access not verified")
                window.location.href = '../index.html';
            }
        })
        .catch(error => {
            alert("Hubo un problema de red.");
            window.location.href = '../index.html';
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


function loadPage(post_id) {
    // Obtener el formulario y agregar el evento de submit para la edición de la flota
    document.getElementById('postForm').addEventListener('submit', function(event) {
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
            const photo = document.getElementById('photo').files[0]; // Asegúrate de obtener el archivo como tal

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
                photo // Guardamos el archivo directamente aquí, no base64
            };

            // Añadir el vehículo a la lista visual
            addVehicleToList(vehicleItem);

        } catch (error) {
            alert(error.message);
        }
    });
}




/*141 editPost.js loadPage*/