<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
header("Content-Type: application/json");
require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([]);
    exit;
}

$userId = $_SESSION["user_id"];

try {
    $stmt = $pdo->prepare("SELECT event_date FROM routine_events WHERE user_id = ?");
    $stmt->execute([$userId]);
    $dates = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode($dates);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
