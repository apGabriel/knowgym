<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once 'db.php';

// Redirigir si no está logueado
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$id_usuario = $_SESSION['user_id'];

// Obtener datos del usuario
$query = "SELECT * FROM users WHERE id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$id_usuario]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario) {
    echo "Error: usuario no encontrado.";
    exit();
}

$mensaje = "";

// Procesar formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $actualizarPassword = !empty($password);

    if ($actualizarPassword) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $update = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
        $stmt = $pdo->prepare($update);
        $exito = $stmt->execute([$nombre, $email, $hashedPassword, $id_usuario]);
    } else {
        $update = "UPDATE users SET username = ?, email = ? WHERE id = ?";
        $stmt = $pdo->prepare($update);
        $exito = $stmt->execute([$nombre, $email, $id_usuario]);
    }

    if ($exito) {
        $_SESSION['user_email'] = $email;
        // Actualizar datos para mostrar después de redirigir
        $usuario['username'] = $nombre;
        $usuario['email'] = $email;

        // Redirigir con mensaje en URL (evita resubmission POST)
        header("Location: editProfile.php?msg=" . urlencode("Correctly updated information."));
        exit();
    } else {
        // Redirigir con mensaje de error
        header("Location: editProfile.php?msg=" . urlencode("Error changing information."));
        exit();
    }
}

