<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header("Content-Type: application/json");

require_once "db.php"; // Aquí defines $pdo

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "User not logged in."]);
    exit;
}

$userId = $_SESSION["user_id"];

try {
    $sql = "
        SELECT 
            r.id AS routine_id, 
            r.name AS routine_name, 
            e.id AS exercise_id,
            e.name AS exercise, 
            mu.muscle_name AS muscle,
            re.sets,
            re.reps,
            re.duration
        FROM routines r
        JOIN routine_exercises re ON r.id = re.routine_id
        JOIN exercises e ON re.exercise_id = e.id
        JOIN muscles mu ON e.muscle_id = mu.id
        WHERE r.user_id = ?
        ORDER BY r.id, mu.muscle_name, e.name
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $routines = [];
    foreach ($result as $row) {
        $id = $row["routine_id"];
        $muscle = $row["muscle"];
        
        if (!isset($routines[$id])) {
            $routines[$id] = [
                "routine_id" => $id,
                "routine_name" => $row["routine_name"],
                "exercises" => []
            ];
        }
        
        if (!isset($routines[$id]["exercises"][$muscle])) {
            $routines[$id]["exercises"][$muscle] = [];
        }
        
        $routines[$id]["exercises"][$muscle][] = [
            "exercise_id" => $row["exercise_id"],
            "exercise_name" => $row["exercise"],
            "sets" => (int)$row["sets"],
            "reps" => is_null($row["reps"]) ? null : (int)$row["reps"],
            "duration" => is_null($row["duration"]) ? null : (int)$row["duration"]
        ];
    }

    // Para que "exercises" sea un array de objetos { muscle: "", exercises: [...] }
    foreach ($routines as &$routine) {
        $muscleGroups = [];
        foreach ($routine["exercises"] as $muscleName => $exercises) {
            $muscleGroups[] = [
                "muscle" => $muscleName,
                "exercises" => $exercises
            ];
        }
        $routine["exercises"] = $muscleGroups;
    }

    echo json_encode(array_values($routines), JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
