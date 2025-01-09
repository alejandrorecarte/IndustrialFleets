function verificarSesion() {
    const token = localStorage.getItem('token'); // O sessionStorage.getItem('token')
    const authButtons = document.getElementById('auth-buttons');  // Cambié el ID a 'auth-buttons' según el HTML.

    // Si hay un token, significa que el usuario está autenticado
    if (token) {
        mostrarContenidoAutenticado(authButtons);
    } else {
        mostrarBotonesLoginRegistro(authButtons);
    }
}

// Mostrar el contenido protegido para usuarios autenticados
function mostrarContenidoAutenticado(authButtons) {
    // Puedes agregar contenido adicional aquí para usuarios autenticados
    const contenido = document.getElementById('contenido');
    contenido.innerHTML = `
        <h1>Bienvenido de nuevo</h1>
        <p>¡Aquí está el contenido exclusivo para usuarios autenticados!</p>
    `;
    
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
    window.location.href = '/img/login.html';  // Redirigir al archivo login.html
}

// Redirigir a la página de Registro
function irRegistro() {
    window.location.href = '/img/register.html';  // Redirigir al archivo register.html
}

// Cerrar sesión (eliminar el token)
function cerrarSesion() {
    localStorage.removeItem('token');  // Elimina el token de localStorage
    window.location.href = '/';  // Redirige al inicio
}

// Llamar a la función al cargar la página
window.onload = function() {
    verificarSesion();
}

document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
});
