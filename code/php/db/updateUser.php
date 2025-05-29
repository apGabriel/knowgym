<?php
include 'check_session.php';
include 'db.php';

if (!$is_logged_in || !$isAdmin) {
    http_response_code(403);
    echo "Forbidden";
    exit;
}

$id = $_POST['id'];
$username = $_POST['username'];
$email = $_POST['email'];
$isAdmin = isset($_POST['isAdmin']) ? 1 : 0;
$password = $_POST['password'] ?? '';

// Si la contraseña viene vacía, no se actualiza
if (!empty($password)) {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, isAdmin = ?, password = ? WHERE id = ?");
    $success = $stmt->execute([$username, $email, $isAdmin, $hashedPassword, $id]);
} else {
    $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, isAdmin = ? WHERE id = ?");
    $success = $stmt->execute([$username, $email, $isAdmin, $id]);
}

if ($success) {
    echo "User updated successfully.";
} else {
    http_response_code(500);
    echo "Failed to update user.";
}
