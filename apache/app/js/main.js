// Verificar si el usuario está autenticado
function verificarSesion() {
    const token = localStorage.getItem('token'); // O sessionStorage.getItem('token')
    const authButtons = document.getElementById('auth-buttons');  // Cambié el ID a 'auth-buttons' según el HTML.

    // Si hay un token, significa que el usuario está autenticado
    if (token) {
        mostrarPosts(authButtons);  // Mostrar los posts si está autenticado
    } else {
        mostrarBotonesLoginRegistro(authButtons); // Mostrar los botones de login y registro
    }
}

// Mostrar los posts para usuarios autenticados
function mostrarPosts(authButtons) {
    const contenido = document.getElementById('contenido');

    // Limpiamos el contenido actual
    contenido.innerHTML = '';

    // Mostrar los posts
    loadPosts();  // Cargar los posts

    // Mostrar el botón de cerrar sesión
    authButtons.innerHTML = `
        <button onclick="cerrarSesion()">Cerrar sesión</button>
    `;
}

// Mostrar los botones de Login y Registro para usuarios no autenticados
function mostrarBotonesLoginRegistro(authButtons) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h1>Bienvenido a la compraventa de vehículos industriales</h1>
        <p>Para acceder a todas las funciones, por favor inicia sesión o regístrate.</p>
    `;

    // Mostrar botones de Login y Registro
    authButtons.innerHTML = `
        <button onclick="irLogin()">Iniciar sesión</button>
        <button onclick="irRegistro()">Registrarse</button>
    `;
}

// Redirigir a la página de Login
function irLogin() {
    window.location.href = '/img/login.html';  // Asegúrate de que la ruta sea la correcta
}

// Redirigir a la página de Registro
function irRegistro() {
    window.location.href = '/img/register.html';  // Asegúrate de que la ruta sea la correcta
}

// Cerrar sesión (eliminar el token)
function cerrarSesion() {
    localStorage.removeItem('token');  // Elimina el token de localStorage
    window.location.href = '/';  // Redirige al inicio
}

// Llamar a la función al cargar la página
window.onload = function () {
    verificarSesion();
}

// URL de la API para obtener los posts
const apiUrl = "/api/post/getlast"; // Reemplaza esta URL con la de tu API real

// Función para cargar los posts
async function loadPosts() {
    try {
        // Obtener el token almacenado en localStorage
        const token = localStorage.getItem('token');

        // Si no hay token, no hacemos la solicitud
        if (!token) {
            alert("No estás autenticado. Por favor, inicia sesión.");
            return;
        }

        // Creamos el objeto de parámetros (simulando un caso como si fuera un "login")
        const params = { page: 0 }; // Parámetros ejemplo

        // Construimos la URL con los parámetros codificados
        const url = `${apiUrl}?${new URLSearchParams(params).toString()}`;

        // Realizamos una solicitud GET a la API para obtener los posts
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Agregar el token como un encabezado Bearer
                'Content-Type': 'application/json'   // Tipo de contenido JSON
            }
        });

        // Verificamos si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error("Error al cargar los posts");
        }

        // Parseamos la respuesta JSON
        const data = await response.json();

        // Obtenemos la referencia al cuerpo de la tabla
        const tableBody = document.querySelector("#postsTable tbody");

        // Limpiamos la tabla antes de llenarla
        tableBody.innerHTML = "";

        // Verificamos que haya posts
        if (data.last_posts && data.last_posts.length > 0) {
            // Iteramos sobre los posts y agregamos una fila para cada uno
            data.last_posts.forEach(post => {
                const row = document.createElement("tr");
                const titleCell = document.createElement("td");
                const descriptionCell = document.createElement("td")
                const imageCell = document.createElement("td");

                // Añadimos el título y la imagen a las celdas
                titleCell.textContent = post.title;

                descriptionCell.textContent = post.description;

                // Aquí asumimos que la API no proporciona imágenes, por lo que dejamos esta parte comentada
                // Si tu API proporciona URLs de imágenes, descomenta y ajusta este bloque:
                // const img = document.createElement("img");
                // img.src = post.imageUrl;  // Asegúrate de que "imageUrl" sea el campo correcto
                // img.alt = post.title;
                // imageCell.appendChild(img);

                // Si no hay imágenes, podemos agregar un texto o dejarlo vacío
                imageCell.textContent = "Imagen no disponible";  // O dejarlo vacío si no tienes imágenes

                // Añadimos las celdas a la fila
                row.appendChild(titleCell);
                row.appendChild(descriptionCell)
                row.appendChild(imageCell);

                // Añadimos la fila al cuerpo de la tabla
                tableBody.appendChild(row);
            });
        } else {
            // Si no hay posts, mostramos un mensaje en la tabla
            const row = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.colSpan = 2;  // Ocupa ambas columnas
            noDataCell.textContent = "No hay posts disponibles en este momento";
            row.appendChild(noDataCell);
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Hubo un error al cargar los posts:", error);
        alert('Hubo un error al cargar los posts');
    }
}

