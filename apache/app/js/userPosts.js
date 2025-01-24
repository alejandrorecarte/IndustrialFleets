let page = 1;

window.onload = function () {
    verificarSesion();
    const cardsSection = document.getElementById('cardsSection');
    const params = new URLSearchParams(window.location.search);
    page = parseInt(params.get('page')); 
    if (page === null || isNaN(page) || page < 1) {
        page = 1;
    }
    // Cargar las tarjetas al cargar la página
    loadCards(cardsSection, page);
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
                    window.location.href = '../index.html?back_url=/img/userPosts.html?page=' + page;
                }
            })
            .catch(error => {
                console.error('Error al verificar la sesión:', error);
            });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Adding event listeners")
    document.getElementById("backButton").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = '/img/home.html';  // Asegúrate de que la ruta sea la correcta
    });
});


// Función para crear una tarjeta
function createCard(title, description, postId) {
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => {
        window.location.href = `post.html?post_id=${postId}`; // Redirigir a post.html con el id del post
    });

    const cardTitle = document.createElement('h2');
    cardTitle.textContent = title;

    const cardDescription = document.createElement('p');
    cardDescription.textContent = description;

    const cardEditButton = document.createElement('button');
    cardEditButton.id = 'editButton';
    cardEditButton.textContent = 'Editar';
    cardEditButton.addEventListener('click', (event) => {
        event.stopPropagation();
        window.location.href = `editPost.html?post_id=${postId}`; // Redirigir a editPost.html con el id del post
    })

    const cardDeleteButton = document.createElement('button');
    cardDeleteButton.id = 'deleteButton';
    cardDeleteButton.textContent = 'Eliminar';
    cardDeleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const confirmacion = confirm("¿Estás seguro de que deseas eliminar este elemento?");

        // Si el usuario confirma la eliminación
        if (confirmacion) {
            // Aquí puedes agregar el código para realizar la eliminación
            fetch(`/api/post/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId })
            })
            .then(response => {
                if (response.ok) {
                    alert("Elemento eliminado.");
                    window.location.reload();
                }else{
                    alert("Hubo un problema al eliminar el elemento.");
                    console.error("Error eliminando el elemento.");
                }
            })
        }
    })

    card.appendChild(cardTitle);
    card.appendChild(cardDescription);
    card.appendChild(cardEditButton);
    card.appendChild(cardDeleteButton);

    return card;
}


function loadCards(cardsSection, page = 0) {
    page--
    console.log("Cargando tarjetas de la página:", page);
    const url = `/api/post/user?page=${page}`; // Construir la URL con el parámetro page
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Llamada la API exitosa.")
            cardsSection.innerHTML = '';
            data.last_posts.forEach(item => {
                console.log("Creando tarjeta para:", item.title);
                const card = createCard(item.title, item.description, item.post_id);
                cardsSection.appendChild(card);
            });
            generatePaginationControls(data.page, data.max_pages);
        })
        .catch(error => console.error('Error al cargar las tarjetas:', error));
}

   // Función para generar los controles de paginación
   function generatePaginationControls(currentPage, maxPages) {
    currentPage++
    console.log("Generando controles de paginación..." + currentPage + " " + maxPages);
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';

    for (let i = 1; i <= maxPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button';
        if (i === currentPage) {
            button.disabled = true;
        }
        button.addEventListener('click', function() { 
            window.location.href = `/img/userPosts.html?page=${i}`;
        });
        paginationControls.appendChild(button); // Asegúrate de agregar el botón al contenedor
    }
}