<?php
session_start();
session_unset();  // Eliminar todas las variables de sesión
session_destroy(); // Destruir la sesión

// Eliminar la cookie de sesión en el navegador, si existe
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 42000, '/'); // Eliminar la cookie
}

// Establecer el encabezado para indicar que la respuesta es JSON
header('Content-Type: application/json');

// Responder con JSON para que el frontend lo maneje
echo json_encode(['success' => true]);

exit();
?>