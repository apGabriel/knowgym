<?php
include 'db.php'; // Conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password === $confirm_password) {
        // Verificar si el email ya está registrado
        $query = $pdo->prepare("SELECT * FROM users WHERE email = :email");
        $query->execute(['email' => $email]);
        $user = $query->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Si el email ya está registrado
            echo json_encode(['success' => false, 'message' => 'Email is already registered']);
        } else {
            // Insertar el nuevo usuario
            $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Hash de la contraseña
            $query = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
            $query->execute(['username' => $username, 'email' => $email, 'password' => $hashed_password]);

            echo json_encode(['success' => true, 'message' => 'Registration successful']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
