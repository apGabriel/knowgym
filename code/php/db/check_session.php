<?php
session_start();

// Verificar si el usuario está logueado o no
$is_logged_in = isset($_SESSION['user_id']) ? true : false;
?>
