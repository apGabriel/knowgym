<?php
session_start();

// Verificar si el usuario está logueado o no
$is_logged_in = isset($_SESSION['user_id']) ? true : false;

// Definir isAdmin solo si está logueado
$isAdmin = false;
if ($is_logged_in && isset($_SESSION['isAdmin'])) {
    $isAdmin = $_SESSION['isAdmin'] == 1; // Asumiendo que 1 es admin, 0 es usuario
}
?>
