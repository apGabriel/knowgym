<?php
session_start();
$disabled = !isset($_SESSION['user_id']) ? 'disabled' : ''; // Si no hay sesión, deshabilitado
?>
