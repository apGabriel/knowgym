document.addEventListener("DOMContentLoaded", function () {
    const calendarButton = document.getElementById("calendar-btn");
    const calendarWarning = document.getElementById("calendar-warning");
    const isAdmin = calendarButton.dataset.isAdmin === "1"; // lee el valor de PHP

    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';

    if (isLoggedIn) {
        calendarButton.classList.remove("disabled");
        calendarWarning.style.display = "none";
    } else {
        calendarButton.classList.add("disabled");
        calendarWarning.style.display = "none";
    }

    calendarButton.addEventListener("click", function (event) {
        if (!isLoggedIn) {
            event.preventDefault();
            calendarWarning.style.display = "block"; // Mostrar advertencia
            return;
        }

        // Redirige dependiendo de si es admin o no
        if (isAdmin) {
            window.location.href = "editAllRoutines.php";
        } else {
            window.location.href = "calendar.php";
        }
    });
});
