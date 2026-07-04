<?php
session_start();
header("Content-Type: application/json");
require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "User not logged in."]);
    exit;
}

$userId = $_SESSION["user_id"];
$date = $_GET["date"] ?? null;

if (!$date) {
    echo json_encode(["error" => "Missing date."]);
    exit;
}

try {
    // Obtener evento
    $stmt = $pdo->prepare("
        SELECT re.id AS event_id, re.routine_id, re.event_date, re.start_time, re.end_time, r.name AS routine_name
        FROM routine_events re
        JOIN routines r ON re.routine_id = r.id
        WHERE re.user_id = ? AND re.event_date = ?
        LIMIT 1
    ");
    $stmt->execute([$userId, $date]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        echo json_encode(null); // No hay evento
        exit;
    }

    // Obtener ejercicios del evento
    $stmt = $pdo->prepare("
        SELECT e.name AS exercise_name, ree.exercise_id, ree.sets, ree.reps, ree.duration, mu.muscle_name
        FROM routine_event_exercises ree
        JOIN exercises e ON ree.exercise_id = e.id
        JOIN muscles mu ON e.muscle_id = mu.id
        WHERE ree.event_id = ?
        ORDER BY mu.muscle_name, e.name
    ");
    $stmt->execute([$event["event_id"]]);
    $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar por músculo
    $grouped = [];
    foreach ($exercises as $ex) {
        $muscle = $ex["muscle_name"];
        unset($ex["muscle_name"]);
        if (!isset($grouped[$muscle])) $grouped[$muscle] = [];
        $grouped[$muscle][] = $ex;
    }

    $event["exercises"] = [];
    foreach ($grouped as $muscle => $list) {
        $event["exercises"][] = [
            "muscle" => $muscle,
            "exercises" => $list
        ];
    }

    echo json_encode($event, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    error_log('getRoutineEventByDate: ' . $e->getMessage());
    echo json_encode(["error" => "Server error."]);
}
