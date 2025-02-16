function showForm(formType) {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');

    if (formType === 'login') {
        document.getElementById('login-form').classList.add('active');
    } else if (formType === 'register') {
        document.getElementById('register-form').classList.add('active');
    }
}

function submitForm(event, formType) {
    event.preventDefault(); // Evita la recarga de la página

    const formData = new FormData(event.target);
    const phpScript = formType === 'login' ? '../php/db/login.php' : '../php/db/register.php';

    fetch(phpScript, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Success: ${data.message}`);

            if (formType === 'register') {
                // Si es el formulario de registro, redirige a login
                window.location.href = 'forms.php?form=login';
            }

            if (formType === 'login') {
                // Guardar sesión en localStorage para manejar el estado en el frontend
                localStorage.setItem('user_logged_in', 'true');

                // Redirigir al index.php
                window.location.href = '../php/index.php';
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
    });
}

// Maneja el parámetro "form" en la URL
const urlParams = new URLSearchParams(window.location.search);
const formType = urlParams.get('form') || 'login'; // Por defecto, muestra login
showForm(formType);

// Asigna el manejador de eventos a los formularios
document.getElementById('login-form').querySelector('form').addEventListener('submit', (event) => submitForm(event, 'login'));
document.getElementById('register-form').querySelector('form').addEventListener('submit', (event) => submitForm(event, 'register'));

// Verificar si el usuario está logueado y redirigir si es necesario
if (localStorage.getItem('user_logged_in') === 'true') {
    window.location.href = '../php/index.php';
}

// --- NUEVO CÓDIGO PARA MANEJAR EL BOTÓN DE CALENDARIO ---
document.addEventListener("DOMContentLoaded", function () {
    const calendarButton = document.getElementById("calendar-button");
    const warningMessage = document.getElementById("calendar-warning");

    if (calendarButton && warningMessage) {
        calendarButton.addEventListener("click", function (event) {
            if (!localStorage.getItem('user_logged_in')) {
                event.preventDefault(); // Evita la redirección
                warningMessage.classList.remove("hidden"); // Muestra el mensaje de advertencia
            }
        });
    }
});
