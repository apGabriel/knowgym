<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'db.php'; // Conexión a la base de datos

// Verificar que el formulario haya sido enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos del formulario
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    $confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

    // Validar los campos
    if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }

    // Verificar que las contraseñas coinciden
    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit();
    }

    // Comprobar si el email ya existe en la base de datos
    $query = "SELECT * FROM users WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit();
    }

    // Insertar el nuevo usuario en la base de datos
    $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
    $stmt = $pdo->prepare($query);
    $password_hash = password_hash($password, PASSWORD_DEFAULT); // Encriptar la contraseña
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password_hash);

    if ($stmt->execute()) {
        // Respuesta de éxito
        echo json_encode(['success' => true, 'message' => 'User registered successfully']);
    } else {
        // Respuesta de error
        echo json_encode(['success' => false, 'message' => 'Error occurred while registering']);
    }
    exit();
}

?>
