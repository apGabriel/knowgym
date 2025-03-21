<?php
// db.php - Conexión a la base de datos
include('db.php');

header('Content-Type: application/json');

// Consulta para obtener los músculos y sus ejercicios con detalles
$sql = "SELECT m.id AS muscle_id, m.muscle_name, e.id AS exercise_id, e.name AS exercise_name, e.gif, e.description
        FROM muscles m
        LEFT JOIN exercises e ON m.id = e.muscle_id
        ORDER BY m.muscle_name";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$muscles = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $muscle_name = $row['muscle_name'];

    if (!isset($muscles[$muscle_name])) {
        $muscles[$muscle_name] = [
            'muscle_name' => $muscle_name,
            'exercises' => []
        ];
    }
    

    if ($row['exercise_id']) {
        $muscles[$muscle_name]['exercises'][] = [
            'name' => $row['exercise_name'],
            'gif' => $row['gif'],
            'description' => $row['description']
        ];
    }
}
// Devolver los resultados como JSON
echo json_encode(array_values($muscles));
?>
