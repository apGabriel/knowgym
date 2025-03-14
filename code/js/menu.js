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

    if (!navLinks) {
        console.error("No se encontró el menú en el DOM.");
        return;
    }

    // Alternar manualmente los estilos en lugar de usar `.show`
    if (navLinks.style.visibility === "visible" && navLinks.style.opacity === "1") {
        navLinks.style.visibility = "hidden";
        navLinks.style.opacity = "0";
        navLinks.style.transform = "translateY(-10px)";
    } else {
        navLinks.style.visibility = "visible";
        navLinks.style.opacity = "1";
        navLinks.style.transform = "translateY(0)";
    }
}


// Asegurar que el evento de clic se agregue correctamente cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) {
        console.error("Error: No se encontró .menu-toggle o .nav-links en el DOM.");
        return;
    }

    menuToggle.addEventListener("click", () => {
        
        // Alternar la clase show
        navLinks.classList.toggle("show");

        // Accesibilidad: cambia aria-expanded
        const isExpanded = navLinks.classList.contains("show");
        menuToggle.setAttribute("aria-expanded", isExpanded);

        
    });
});


