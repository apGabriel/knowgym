<?php
// logout.php
session_start();
session_unset();  // Eliminar todas las variables de sesión
session_destroy(); // Destruir la sesión

// Eliminar la cookie de sesión en el navegador, si existe
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 42000, '/'); // Eliminar la cookie
}

// Verifica si la sesión fue destruida correctamente
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => true, 'message' => 'Session destroyed']);
} else {
    echo json_encode(['success' => false, 'message' => 'Session not destroyed']);
}

exit();


?>