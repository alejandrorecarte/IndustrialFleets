// Llamar a la función al cargar la página
window.onload = function () {
    verificarSesion();
}

// Verificar si el usuario está autenticado
function verificarSesion() {
    const token = getCookie('access_token'); // Obtener el token de la cookie
    const authButtons = document.getElementById('auth-buttons');  // Cambié el ID a 'auth-buttons' según el HTML.

    if (token === null) {
        (authButtons)
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
                    (authButtons);
                    console.log("Cookie not verified")
                }
            })
            .catch(error => {
                console.error('Error al verificar la sesión:', error);
                (authButtons);  // Si hay un error, mostrar los botones de login y registro
            });
    }
}

// Obtener el valor de una cookie por su nombre
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Mostrar los botones de Login y Registro para usuarios no autenticados
function mostrarBotonRegistro(authButtons) {
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <p>Para acceder a todas las funciones, por favor inicia sesión o regístrate.</p>
    `;

    // Mostrar botones de Login y Registro
    authButtons.innerHTML = `
        <button onclick="irRegistro()">Registrarse</button>
    `;
}

// Redirigir a la página de Registro
function irRegistro() {
    window.location.href = '/img/register.html';  // Asegúrate de que la ruta sea la correcta
}



/*********************LOGIN******************/

// Obtener el formulario y agregar el evento de submit
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    // Recoger los datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Construimos la URL con los parámetros codificados
    const url = `http://localhost:8000/users/login`;

    // Enviar los datos al backend
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        }),
        credentials: 'include', // Esto permite enviar cookies
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/img/home.html';  // Redirigir al usuario a la página de inicio
            } else {
                alert('Hubo un problema al iniciar sesión');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al iniciar sesión');
        });
});