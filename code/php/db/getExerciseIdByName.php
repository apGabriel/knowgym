<?php
header('Content-Type: application/json');

if (!isset($_GET['name'])) {
    echo json_encode(['error' => 'No exercise name provided']);
    exit;
}

$name = $_GET['name'];

// Incluir la conexión PDO
require_once 'db.php';

try {
    $stmt = $pdo->prepare("SELECT id FROM exercises WHERE name = :name LIMIT 1");
    $stmt->execute(['name' => $name]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        echo json_encode(['exercise_id' => $result['id']]);
    } else {
        echo json_encode(['exercise_id' => null]);
    }
} catch (PDOException $e) {
    error_log('getExerciseIdByName: ' . $e->getMessage());
    echo json_encode(['error' => 'Database error.']);
}
