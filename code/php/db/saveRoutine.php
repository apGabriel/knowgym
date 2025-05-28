<?php
require_once 'db.php'; // Tu archivo de conexión

session_start();
$userId = $_SESSION['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$routineName = $data["routine_name"];
$exercises = $data["exercises"];

try {
    // Insertar rutina
    $stmt = $pdo->prepare("INSERT INTO routines (user_id, name) VALUES (?, ?)");
    $stmt->execute([$userId, $routineName]);
    $routineId = $pdo->lastInsertId();

    // Insertar ejercicios en routine_exercises
    foreach ($exercises as $item) {
        $exerciseName = $item["exercise"];
        $stmt = $pdo->prepare("SELECT id FROM exercises WHERE name = ?");
        $stmt->execute([$exerciseName]);
        $exerciseId = $stmt->fetchColumn();

        if ($exerciseId) {
            $insertExercise = $pdo->prepare("INSERT INTO routine_exercises (routine_id, exercise_id) VALUES (?, ?)");
            $insertExercise->execute([$routineId, $exerciseId]);
        }
    }

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
