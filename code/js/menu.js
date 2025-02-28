function toggleMenu() {
    const navLinks = document.querySelector('ul.nav-links');
    navLinks.classList.toggle('show');  // Esto alternará la clase 'show'
}

function logoutUser() {
    console.log("Intentando cerrar sesión...");  // Depuración: Indicar que se está intentando cerrar sesión

    fetch('db/logout.php', {
        method: 'POST', // Enviamos la solicitud por POST
        credentials: 'same-origin' // Para enviar las cookies de sesión
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Sesión cerrada con éxito");  // Depuración: Mensaje cuando la sesión se cierre correctamente
            location.reload(); // Recarga la página después de cerrar sesión
            toggleMenu();
        } else {
            console.error("Error al cerrar sesión:", data.message); // Depuración: Si hay un error, se muestra en consola
            alert("Error al cerrar sesión");
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de logout:', error);  // Depuración: Si ocurre un error con la solicitud fetch
    });
}
function toggleMenu() {
    const navLinks = document.querySelector('ul.nav-links');
    navLinks.classList.toggle('show');  // Esto alternará la clase 'show'
}

function logoutUser() {
    fetch('db/logout.php', {
        method: 'POST', // Enviamos la solicitud por POST
        credentials: 'same-origin' // Para enviar las cookies de sesión
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);  // Verifica lo que devuelve el servidor
        if (data.success) {
            location.reload(); // Recarga la página después de cerrar sesión
            toggleMenu();
        } else {
            alert("Error al cerrar sesión");
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de logout:', error);
        alert("Hubo un error al cerrar sesión");
    });
}


