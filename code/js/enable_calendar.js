document.addEventListener("DOMContentLoaded", function() {
    const calendarButton = document.getElementById("calendar-btn");
    const calendarWarning = document.getElementById("calendar-warning");

    // Verificación de sesión al cargar la página
    if (localStorage.getItem('user_logged_in') === 'true') {
        calendarButton.classList.remove("disabled"); // Habilitar el botón
        calendarWarning.style.display = "none"; // Ocultar mensaje
    } else {
        calendarButton.classList.add("disabled"); // Deshabilitar el botón visualmente
        calendarWarning.style.display = "none"; // Asegúrate de que el mensaje esté oculto al cargar
    }

    // Si el usuario no está logeado y hace clic en el calendario, muestra el mensaje
    calendarButton.addEventListener("click", function(event) {
        // Si el usuario no está logueado
        if (localStorage.getItem('user_logged_in') !== 'true') {
            event.preventDefault(); // Evitar la acción del clic (no redirigir)
            calendarWarning.style.display = "block"; // Mostrar el mensaje
        } else {
            // Si el usuario está logueado, redirigir al calendario
            window.location.href = "calendar.php"; // Redirección al calendario
        }
    });
});
