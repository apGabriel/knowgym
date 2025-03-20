<?php
// Conectar con la base de datos
include('db.php');

header('Content-Type: application/json');

// Consulta para obtener los músculos, sus ejercicios y los detalles de cada ejercicio
$sql = "SELECT m.muscle_name, m.exercises, e.name AS exercise_name, e.gif, e.description 
        FROM muscles m
        LEFT JOIN exercises e ON JSON_CONTAINS(m.exercises, CONCAT('\"', e.name, '\"'))";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$muscleData = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $muscleName = $row['muscle_name'];
    
    if (!isset($muscleData[$muscleName])) {
        $muscleData[$muscleName] = [
            "muscle_name" => $muscleName,
            "exercises" => [],
        ];
    }

    if ($row['exercise_name']) {
        $muscleData[$muscleName]["exercises"][] = [
            "name" => $row['exercise_name'],
            "gif" => $row['gif'],
            "description" => $row['description']
        ];
    }
}

// Convertir el array asociativo en un índice secuencial para JSON
echo json_encode(array_values($muscleData));
?>
