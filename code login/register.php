<?php
session_start();
$dataFile = '../data/usuarios.json';

// Habilitar errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Leer el archivo JSON
$usuarios = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];

// Obtener los datos del formulario de registro
$nombre = $_POST['name'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['pswd'] ?? '';

// Validar entrada básica
if (empty($nombre) || empty($apellidos) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
    exit;
}

// Validar formato del correo electrónico
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Por favor, ingresa un correo electrónico válido."]);
    exit;
}

// Comprobar si el correo ya está registrado
foreach ($usuarios as $usuario) {
    if ($usuario['email'] === $email) {
        echo json_encode(["success" => false, "message" => "El correo electrónico ya está registrado."]);
        exit;
    }
}

// Asignar un ID numérico incrementando el último ID
$id = count($usuarios) > 0 ? max(array_column($usuarios, 'user_id')) + 1 ;

// Agregar el nuevo usuario al array
$nuevoUsuario = [
    'user_id' => $id, // Usamos el ID incrementado
    'nombre' => $nombre,
    'apellidos' => $apellidos,
    'email' => $email,
    'password' => password_hash($password, PASSWORD_DEFAULT), // Guardar la contraseña encriptada
];
$usuarios[] = $nuevoUsuario;

// Guardar el array de usuarios de vuelta en el archivo JSON
file_put_contents($dataFile, json_encode($usuarios, JSON_PRETTY_PRINT));

// Responder con éxito
echo json_encode(["success" => true, "message" => "Registro exitoso. Ya puedes iniciar sesión."]);
?>
