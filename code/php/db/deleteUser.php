<?php
// Ajustar las rutas de inclusión desde /php/db/
include 'check_session.php';
include 'db.php';

if (!$is_logged_in || !$isAdmin) {
    // Redirige al index general (fuera de /db)
    header("Location: ../index.php");
    exit;
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    // Redirige al panel de edición principal
    header("Location: ../editAllProfiles.php");
    exit;
}

$user_id_to_delete = intval($_GET['id']);
$current_user_id = $_SESSION['user_id'];

// Evitar que el usuario se elimine a sí mismo
if ($user_id_to_delete === $current_user_id) {
    header("Location: ../editAllProfiles.php?error=cannot_delete_self");
    exit;
}

// Verificar si el usuario existe
$stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
$stmt->execute([$user_id_to_delete]);
$user = $stmt->fetch();

if (!$user) {
    header("Location: ../editAllProfiles.php?error=user_not_found");
    exit;
}

// Eliminar usuario
$stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
$stmt->execute([$user_id_to_delete]);

header("Location: ../editAllProfiles.php?success=user_deleted");
exit;
?>
