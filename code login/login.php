<?php
session_start();
$dataFile = '../data/usuarios.json';

// Leer el archivo JSON
$usuarios = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

// Obtener los datos del formulario de inicio de sesión
$email = $_POST['email'] ?? '';
$password = $_POST['pswd'] ?? '';

// Validar entrada básica
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit;
}

// Buscar al usuario por email
$usuarioEncontrado = null;
foreach ($usuarios as $usuario) {
    if ($usuario['email'] === $email) {
        $usuarioEncontrado = $usuario;
        break;
    }
}

if ($usuarioEncontrado) {
    // Verificar la contraseña
    if (password_verify($password, $usuarioEncontrado['password'])) {
        // Iniciar sesión y guardar datos relevantes
        $_SESSION['user'] = [
            "user_id" => $usuarioEncontrado['user_id'],
            "nombre" => $usuarioEncontrado['nombre'],
            "email" => $usuarioEncontrado['email'],
        ];

        // Responder con éxito
        echo json_encode(["success" => true, "message" => "Bienvenido, " . $usuarioEncontrado['nombre'] . "!"]);
        exit;
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta."]);
        exit;
    }
}

// Si no se encontró el usuario
echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
?>
