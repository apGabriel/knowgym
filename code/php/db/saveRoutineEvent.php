<?php
session_start();
header("Content-Type: application/json");

require_once "db.php"; // Conexión PDO en $pdo

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit;
}

$userId = $_SESSION["user_id"];
$data = json_decode(file_get_contents("php://input"), true);

if (
    !$data ||
    !isset($data["routine_id"], $data["event_date"], $data["start_time"], $data["end_time"], $data["exercises"])
) {
    echo json_encode(["success" => false, "message" => "Invalid input."]);
    exit;
}

$routineId = $data["routine_id"];
$eventDate = $data["event_date"];
$startTime = $data["start_time"];
$endTime = $data["end_time"];
$exercises = $data["exercises"];

try {
    $pdo->beginTransaction();

    // 1. Verificar si ya existe un evento para ese usuario y fecha
    $stmt = $pdo->prepare("SELECT id FROM routine_events WHERE user_id = ? AND event_date = ?");
    $stmt->execute([$userId, $eventDate]);
    $existingEventId = $stmt->fetchColumn();

    if ($existingEventId) {
        // Eliminar ejercicios asociados
        $pdo->prepare("DELETE FROM routine_event_exercises WHERE event_id = ?")->execute([$existingEventId]);
        // Eliminar el evento
        $pdo->prepare("DELETE FROM routine_events WHERE id = ?")->execute([$existingEventId]);
    }

    // 2. Insertar el nuevo evento
    $stmt = $pdo->prepare("
        INSERT INTO routine_events (user_id, routine_id, event_date, start_time, end_time)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$userId, $routineId, $eventDate, $startTime, $endTime]);
    $eventId = $pdo->lastInsertId();

    // 3. Insertar los ejercicios asociados
    $insertExercise = $pdo->prepare("
        INSERT INTO routine_event_exercises (event_id, exercise_id, sets, reps, duration)
        VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($exercises as $ex) {
        $insertExercise->execute([
            $eventId,
            $ex["exercise_id"],
            $ex["sets"],
            $ex["reps"],
            $ex["duration"]
        ]);
    }

    $pdo->commit();
    echo json_encode(["success" => true, "event_id" => $eventId]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    error_log('saveRoutineEvent: ' . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Server error."]);
}
