<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header("Content-Type: application/json");
require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "User not logged in."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["event_date"])) {
    echo json_encode(["success" => false, "message" => "Missing event date."]);
    exit;
}

$userId = $_SESSION["user_id"];
$eventDate = $data["event_date"];

try {
    // Eliminar el evento si pertenece al usuario
    $stmt = $pdo->prepare("DELETE FROM routine_events WHERE user_id = ? AND event_date = ?");
    $stmt->execute([$userId, $eventDate]);

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
