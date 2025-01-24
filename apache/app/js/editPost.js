let post_id = null

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    post_id = parseInt(params.get('post_id'));
    verificarSesion();
    verificarAcceso(post_id);

    document.getElementById("backButton").addEventListener("click", function (event) {
        document.location.href = '/img/userPosts.html';
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
    fetch('/api/post/access?post_id=' + post_id, {
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

// Inicializa el array de vehículos y el objeto de información de la flota
let postInfo = {}; // Asegúrate de que postInfo contenga la información necesaria


// Función para añadir el vehículo a la lista visual
function addVehicleToList(vehicleItem) {

    const vehicleList = document.getElementById('vehicleList');
    const vehicleDiv = document.createElement('div');
    vehicleDiv.classList.add('vehicle-item');
    const imageBase64 = `data:image/png;base64,${vehicleItem.photo}`;


    // Creamos el contenido HTML para el vehículo
    vehicleDiv.innerHTML = `
        <button id="editVehicleButton" onclick="openVehicleWindow('${vehicleItem.license_plate}');">Editar vehículo</button>
        <button id="deleteVehicleButton" onclick="deleteVehicle('${vehicleItem.license_plate}');">Eliminar vehículo</button>
        <h3>${vehicleItem.brand} ${vehicleItem.model} (${vehicleItem.registration_year})</h3>
        <p>Precio: ${vehicleItem.price}€</p>
        <p>${vehicleItem.observations}</p>
        <p>Tipo de Vehículo: ${vehicleItem.vehicleType}</p>
        <p>Combustible: ${vehicleItem.fuelType}</p>
        <p>Matrícula: ${vehicleItem.license_plate}</p>
        <img src="${imageBase64}" alt="Foto del vehículo" style="width: 100px; margin: 5px;">
    `;

    vehicleList.appendChild(vehicleDiv);

    // Limpiar el formulario
    document.getElementById('vehicleForm').reset();
}

function openVehicleWindow(license_plate) {
    window.open(`editVehicle.html?${new URLSearchParams({ post_id, license_plate: license_plate }).toString()}`, '_blank', 'width=800,height=600');
}

function deleteVehicle(license_plate) {
    const body = { "license_plate": license_plate }

    const url = '/api/vehicle/delete';
    try {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(response => {
            if (response.ok) {
                alert("Vehículo eliminado correctamente");
                console.log("Vehicle deleted successfully");
                document.location.reload();
            } else {
                alert("Hubo un problema al eliminar el vehículo.");
                console.error("Error deleting vehicle.");
                throw new Error('Hubo un problema al eliminar el vehículo.');
            }
        })
    } catch (error) {
        alert("Hubo un problema de red.");
        console.error("Error de red:", error);
    }
}

function loadPage(post_id) {
    // Obtener el formulario y agregar el evento de submit para la creación de la flota
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

    fetch("/api/post/get?post_id=" + post_id, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    const post = data.post;
                    document.getElementById("title").value = post.title;
                    document.getElementById("description").value = post.description;

                    fetch("/api/vehicle/post?post_id=" + post_id, {
                        method: 'GET'
                    })
                        .then(response => {
                            if (response.ok) {
                                response.json().then(data => {
                                    const vehicles = data.vehicles;
                                    vehicles.forEach(vehicle => {
                                        const vehicleItem = {
                                            license_plate: vehicle.license_plate,
                                            brand: vehicle.brand,
                                            model: vehicle.model,
                                            registration_year: vehicle.registration_year,
                                            price: vehicle.price,
                                            observations: vehicle.observations,
                                            vehicleType: vehicle.vehicle_type,
                                            fuelType: vehicle.fuel_type,
                                            photo: vehicle.photo
                                        };
                                        addVehicleToList(vehicleItem);
                                    });
                                });
                            } else {
                                throw new Error('Hubo un problema al cargar los vehículos.');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('Hubo un problema al cargar los vehículos.');
                        });
                });
            } else {
                throw new Error('Hubo un problema al cargar el post.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al cargar el post.');
        })

    document.getElementById("addVehicleButton").addEventListener("click", function () {
        document.getElementById("vehicleFormSection").style.display = "block";
        document.getElementById("license_plate").focus()
        document.getElementById("license_plate").value = "";
        document.getElementById("brand").value = "";
        document.getElementById("model").value = "";
        document.getElementById("registration_year").value = "";
        document.getElementById("price").value = "";
        document.getElementById("observations").value = "";
        document.getElementById("vehicleType").value = "";
        document.getElementById("fuelType").value = "";
        document.getElementById("photo").files[0] = null;
        document.getElementById("addVehicleButton").style.display = "none";
    })

    document.getElementById("addVehicleBtn").addEventListener("click", function () {

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

            const formData = new FormData();
            formData.append('license_plate', vehicleItem.license_plate);
            formData.append('brand', vehicleItem.brand);
            formData.append('model', vehicleItem.model);
            formData.append('registration_year', vehicleItem.registration_year);
            formData.append('price', vehicleItem.price);
            formData.append('observations', vehicleItem.observations);
            formData.append('vehicle_type', vehicleItem.vehicleType);
            formData.append('fuel_type', vehicleItem.fuelType);
            formData.append('post_id', post_id); // Aquí el `post_id` ya debería ser válido
            formData.append('photo', vehicleItem.photo); // Ahora enviamos el archivo, no el base64
    
            fetch('/api/vehicle/create', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    alert("Vehículo añadido correctamente");
                    console.log("Vehicle added successfully");
                    document.location.reload();
                } else {
                    alert("Hubo un problema al añadir el vehículo.");
                    console.error("Error adding vehicle.");
                    throw new Error('Hubo un problema al añadir el vehículo.');
                }
            }).catch(error => {
                console.error('Error al añadir el vehículo:', error);
            });

            // Añadir el vehículo a la lista visual
            addVehicleToList(vehicleItem);

        } catch (error) {
            alert(error.message);
        }
    })

    document.getElementById("editPostButton").addEventListener("click", function (event) {
        fetch('/api/post/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id, title: document.getElementById("title").value, description: document.getElementById("description").value })
        })
            .then(response => {
                if (response.ok) {
                    alert("Post editado correctamente");
                    console.log("Post edited successfully");
                    document.location.reload();
                } else {
                    alert("Hubo un problema al editar el post.");
                    console.error("Error editing post.");
                    throw new Error('Hubo un problema al editar el post.');
                }
            })
            .catch(error => {
                alert("Hubo un problema de red.");
                console.error("Error de red:", error);
            });
    })
}