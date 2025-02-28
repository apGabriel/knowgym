<?php
session_start();

// Verificar si el usuario está logueado
$is_logged_in = isset($_SESSION['user_id']) ? true : false;

// Retornar la información como JSON
echo json_encode(['is_logged_in' => $is_logged_in]);

?>
