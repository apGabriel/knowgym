<?php
// db.php - Archivo de conexión a la base de datos
$host = 'localhost';
$dbname = 'knowgym'; // Nombre de tu base de datos
$username = 'gabriel'; // Usuario de la base de datos
$password = '***REMOVED***'; // Contraseña, si la tienes configurada

try {
    // Crear la conexión
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Error de conexión: ' . $e->getMessage());
}
?>
