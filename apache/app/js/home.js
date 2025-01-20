window.onload = function () {
    verificarSesion();
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
                    window.location.href = '../index.html';
                }
            })
            .catch(error => {
                console.error('Error al verificar la sesión:', error);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("addPostButton").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = '/img/createPost.html';  // Asegúrate de que la ruta sea la correcta
    });

    document.getElementById("logoutButton").addEventListener("click", function (event) {
        fetch('/api/users/logout', {
            method: 'POST'
        })
            .then(response => {
                if (response.ok) {
                    // Si la respuesta es OK (status 200), el token es válido
                    console.log("Session Closed")
                    window.location.href = '../index.html';  // Asegúrate de que la ruta sea la correcta
                } else {
                    console.log("Session not closed")
                    alert("No se pudo cerrar la sesión")
                }
            })
            .catch(error => {
                console.error('Error al verificar la sesión:', error);
                mostrarBotonesLoginRegistro(authButtons);  // Si hay un error, mostrar los botones de login y registro
            });
    })
});