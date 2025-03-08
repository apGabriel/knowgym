function logoutUser() {
    console.log("Intentando cerrar sesión...");

    fetch('db/logout.php', {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del servidor:", data);  

        if (data.success) {
            console.log("Sesión cerrada con éxito");

            //  Limpiar almacenamiento local para asegurar cierre completo
            localStorage.clear();
            sessionStorage.clear();

            //  Recargar la página para reflejar los cambios
            location.reload();
        } else {
            console.error("Error al cerrar sesión:", data.message);
            alert("Error al cerrar sesión");
        }
    })
    .catch(error => {
        console.error('Error en la solicitud de logout:', error);
        alert("Hubo un error al cerrar sesión");
    });
}

// Función para alternar la visibilidad del menú en móviles
function toggleMenu() {

    const navLinks = document.querySelector(".nav-links");
    /* me quede aqui, si que entra en el evento pero no devuelve nada*/
    if (!navLinks) {
        console.error("No se encontró el menú en el DOM.");
        return;
    }
    
    navLinks.classList.toggle("show");
}

// Asegurar que el evento de clic se agregue correctamente cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);

    } else {
        console.error("Error: No se encontró .menu-toggle en el DOM.");
    }
});
