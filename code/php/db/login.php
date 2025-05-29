<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // <-- IMPORTANTE

session_start(); // Iniciar sesión

include 'db.php'; // Conexión a la base de datos

try {
    // Verificar que el formulario haya sido enviado
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del formulario
        $email = isset($_POST['email']) ? $_POST['email'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        // Validar los campos
        if (empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Email and Password are required']);
            exit();
        }

        // Comprobar si el usuario existe en la base de datos
        $query = "SELECT id, password, isAdmin FROM users WHERE email = :email";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Guardar datos en la sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $email;
            $_SESSION['isAdmin'] = $user['isAdmin'];

            // Login exitoso
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'redirect' => $user['isAdmin'] ? 'admin_dashboard.php' : 'index.php'
            ]);
        } else {
            // Login fallido
            echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        }

        exit();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        exit();
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit();
}
?>
