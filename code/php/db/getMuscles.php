<?php
// db.php - Conexión a la base de datos
include('db.php');

header('Content-Type: application/json');

// Consulta para obtener los músculos y sus ejercicios
$sql = "SELECT muscle_name, exercises FROM muscles";
$stmt = $pdo->prepare($sql);
$stmt->execute();

// Recuperar los resultados como un array asociativo
$muscles = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Devolver los resultados como JSON
echo json_encode($muscles);
?>
