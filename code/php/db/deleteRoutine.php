<?php
// Incluir el archivo de conexión
include('db.php');  // Asegúrate de que la ruta sea correcta

// Habilitar la visualización de errores para la depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Limpia cualquier salida anterior
ob_clean();

// Establecer el tipo de contenido a JSON
header('Content-Type: application/json');

// Leer los datos enviados por POST
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Verificar que se haya recibido el 'routine_id'
if (!isset($data['routine_id'])) {
    echo json_encode(["success" => false, "message" => "Routine ID not provided."]);
    exit;
}

// Convertir el ID de la rutina a un número entero
$routineId = intval($data['routine_id']);

// Comprobar si la conexión a la base de datos está establecida
if (!$pdo) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

try {
    // Preparar y ejecutar la consulta para eliminar la rutina
    $stmt = $pdo->prepare("DELETE FROM routines WHERE id = ?");
    $stmt->execute([$routineId]);

    // Verificar si se eliminó la rutina
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Routine deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Routine not found or already deleted."]);
    }
} catch (PDOException $e) {
    // Si ocurre un error en la base de datos, se captura y se envía el mensaje
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
