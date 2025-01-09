// Obtener el formulario y agregar el evento de submit
document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    // Recoger los datos del formulario
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const password = document.getElementById('password').value;

    // Creamos el objeto de parámetros
    const params = { email, name, surname, password };

    // Construimos la URL con los parámetros codificados
    const url = `http://localhost:8000/api/register?${new URLSearchParams(params).toString()}`;

    // Enviar los datos al backend
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            name: name,
            surname: surname,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Guardar el token de sesión en localStorage
            localStorage.setItem('token', data.token);
            window.location.href = '/';  // Redirigir a la página principal
        } else {
            alert('Error al registrarse');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al registrarse');
    });
});
