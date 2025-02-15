<?php
include 'db.php'; // Conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Verificar si el email existe en la base de datos
    $query = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $query->execute(['email' => $email]);
    $user = $query->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // Si el login es exitoso
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        // Si el email o la contraseña son incorrectos
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
