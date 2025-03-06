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

            // 🧹 Limpiar almacenamiento local para asegurar cierre completo
            localStorage.clear();
            sessionStorage.clear();

            // 🔄 Recargar la página para reflejar los cambios
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
