<?php
include('db.php');

// Activar errores para desarrollo
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Limpiar cualquier salida previa
ob_start();
header('Content-Type: application/json');

// Leer y decodificar el cuerpo JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Validación de estructura JSON
if (
    !$data || 
    !isset($data['routine_id']) || 
    !isset($data['routine_name']) || 
    !is_array($data['exercises'])
) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Missing or invalid data."]);
    exit;
}

$routineId = intval($data['routine_id']);
$name = trim($data['routine_name']);
$exercises = $data['exercises'];

try {
    $pdo->beginTransaction(); // Iniciar transacción

    // 1. Actualizar nombre de rutina
    $stmt = $pdo->prepare("UPDATE routines SET name = ? WHERE id = ?");
    $stmt->execute([$name, $routineId]);

    // 2. Borrar ejercicios actuales
    $stmt = $pdo->prepare("DELETE FROM routine_exercises WHERE routine_id = ?");
    $stmt->execute([$routineId]);

    // 3. Insertar nuevos ejercicios
    $stmt = $pdo->prepare("INSERT INTO routine_exercises (routine_id, exercise_id, sets, reps, duration) VALUES (?, ?, ?, ?, ?)");
    $exerciseNames = [];

    foreach ($exercises as $ex) {
        if (!isset($ex['exercise_id'])) continue;

        $exerciseId = intval($ex['exercise_id']);
        $sets = intval($ex['sets'] ?? 3);
        $reps = isset($ex['reps']) ? intval($ex['reps']) : null;
        $duration = isset($ex['duration']) ? intval($ex['duration']) : null;

        // Insertar ejercicio
        $stmt->execute([$routineId, $exerciseId, $sets, $reps, $duration]);

        // Obtener nombre del ejercicio
        $nameStmt = $pdo->prepare("SELECT name FROM exercises WHERE id = ?");
        $nameStmt->execute([$exerciseId]);
        $exerciseName = $nameStmt->fetchColumn();

        // Almacenar nombre del ejercicio
        $exerciseNames[] = [
            'exercise_id' => $exerciseId,
            'exercise_name' => $exerciseName,
            'sets' => $sets,
            'reps' => $reps,
            'duration' => $duration
        ];
    }

    $pdo->commit(); // Confirmar transacción
    ob_end_clean(); // Limpiar buffer antes de enviar salida

    echo json_encode([
        "success" => true,
        "message" => "Routine updated successfully.",
        "updated_routine" => [
            "id" => $routineId,
            "name" => $name,
            "exercises_count" => count($exercises),
            "exercises" => $exerciseNames // Devolver los ejercicios con su nombre
        ]
    ]);
} catch (PDOException $e) {
    $pdo->rollBack(); // Revertir cambios en caso de error
    ob_end_clean(); // Limpiar buffer antes del error
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
