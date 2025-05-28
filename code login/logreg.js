// ==================== LOGIN ====================
const loginForm = document.querySelector('#loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Recopilar los datos del formulario
        const formData = new FormData(loginForm);
        formData.append('submit', 'login'); // Añadir explícitamente el campo 'submit'

        try {
            const response = await fetch('./php/login.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                // Si la respuesta no es exitosa, lanzar un error con el código de estado
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const text = await response.text();
            console.log('Raw Response:', text);

            try {
                const result = JSON.parse(text);
                console.log('Parsed Response:', result);

                alert(result.message);

                if (result.success) {
                    window.location.href = './game.php';
                }
            } catch (jsonError) {
                console.error('Error al parsear JSON:', jsonError);
                alert('Hubo un problema con el servidor. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema con el inicio de sesión. Por favor, inténtalo de nuevo.');
        }
    });
}

// ==================== REGISTRO ====================
const registerForm = document.querySelector('#registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();  // Evitar el envío tradicional del formulario

        // Recopilar los datos del formulario
        const formData = new FormData(registerForm);
        formData.append('submit', 'register');  // Añadir explícitamente el campo 'submit'

        try {
            const response = await fetch('./php/register.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                // Si la respuesta no es exitosa, lanzar un error con el código de estado
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const text = await response.text();  // Obtener la respuesta del servidor
            console.log('Raw Response (Registro):', text);

            // Verificar si la respuesta comienza con HTML (esto indica un error)
            if (text.trim().startsWith('<')) {  // Si empieza con HTML
                throw new Error('Respuesta no válida (HTML en lugar de JSON)');
            }

            try {
                const result = JSON.parse(text);  // Parsear la respuesta JSON
                console.log('Parsed Response (Registro):', result);

                if (result.success) {
                    // Mostrar mensaje de éxito en la página, sin redirigir
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.textContent = 'Registro exitoso. Ya puedes iniciar sesión.';
                    document.body.appendChild(successMessage);  // Agregar el mensaje al cuerpo de la página
                } else {
                    // Si no es exitoso, muestra el mensaje de error
                    alert(result.message);
                }

                // Limpiar el formulario después del registro
                registerForm.reset();

            } catch (jsonError) {
                console.error('Error al parsear JSON en registro:', jsonError);
                console.error('Respuesta recibida:', text); // Imprimir la respuesta completa si el JSON es inválido
                alert('Hubo un problema con el servidor durante el registro.');
            }
        } catch (error) {
            console.error('Error en la solicitud de registro:', error);
            alert('Hubo un problema con el registro. Por favor, inténtalo de nuevo.');
        }
    });
}
