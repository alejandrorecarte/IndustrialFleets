// Obtener el formulario y agregar el evento de submit
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    // Recoger los datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Construimos la URL con los parámetros codificados
    const url = `/api/users/login`;

    // Enviar los datos al backend
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/';
        }else{
            alert('Hubo un problema al iniciar sesión');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al iniciar sesión');
    });
});
