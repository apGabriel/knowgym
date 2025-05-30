<?php
include 'check_session.php';
include 'db.php';

if (!$is_logged_in || !$isAdmin) {
    header("Location: ../index.php");
    exit;
}

$error = '';
$success = '';
$users = [];
$routines = [];
$routineExercises = [];

try {
    // Obtener usuarios no administradores
    $user_stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE isAdmin = 0 ORDER BY username ASC");
    $user_stmt->execute();
    $users = $user_stmt->fetchAll(PDO::FETCH_ASSOC);

    $selected_user_id = $_GET['user_id'] ?? null;

    if ($selected_user_id) {
        // Obtener las rutinas del usuario
        $stmt = $pdo->prepare("SELECT * FROM routines WHERE user_id = :user_id ORDER BY id DESC");
        $stmt->execute(['user_id' => $selected_user_id]);
        $routines = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener los ejercicios asociados a las rutinas
        if (!empty($routines)) {
            $routineIds = array_column($routines, 'id');
            $inClause = implode(',', array_fill(0, count($routineIds), '?'));

            $stmt = $pdo->prepare("
                SELECT re.*, e.name AS exercise_name 
                FROM routine_exercises re
                JOIN exercises e ON re.exercise_id = e.id
                WHERE re.routine_id IN ($inClause)
            ");
            $stmt->execute($routineIds);
            $routineExercisesData = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Agrupar los ejercicios por rutina
            foreach ($routineExercisesData as $ex) {
                $routineExercises[$ex['routine_id']][] = $ex;
            }
        }
    }

} catch (PDOException $e) {
    die("Error loading data: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'edit') {
        $id = $_POST['routine_id'] ?? null;
        $title = trim($_POST['title'] ?? '');
        $exercise_names = $_POST['exercise_name'] ?? [];
        $sets = $_POST['sets'] ?? [];
        $reps = $_POST['reps'] ?? [];
        $durations = $_POST['duration'] ?? [];

        if (!$id || !$title) {
            $error = "All fields are required.";
        } else {
            // Actualizar el nombre de la rutina
            $stmt = $pdo->prepare("UPDATE routines SET name = :title WHERE id = :id");
            $stmt->execute([
                ':title' => $title,
                ':id' => $id
            ]);

            // Eliminar ejercicios actuales
            $stmt = $pdo->prepare("DELETE FROM routine_exercises WHERE routine_id = ?");
            $stmt->execute([$id]);

            // Insertar nuevos ejercicios (validar y sanitizar datos)
            for ($i = 0; $i < count($exercise_names); $i++) {
                $name = trim($exercise_names[$i]);

                if (empty($name)) continue;

                $setCount = max(0, intval($sets[$i] ?? 0));
                $repCount = max(0, intval($reps[$i] ?? 0));
                $durationSec = max(0, intval($durations[$i] ?? 0));

                // Obtener ID ejercicio por nombre (mejor usar ID directo si puedes modificar el form para enviar exercise_id)
                $stmt = $pdo->prepare("SELECT id FROM exercises WHERE name = ?");
                $stmt->execute([$name]);
                $exercise = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($exercise) {
                    $exerciseId = $exercise['id'];

                    $stmt = $pdo->prepare("
                        INSERT INTO routine_exercises (routine_id, exercise_id, sets, reps, duration) 
                        VALUES (?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([$id, $exerciseId, $setCount, $repCount, $durationSec]);
                } else {
                    // Podrías manejar un error o crear el ejercicio aquí si no existe
                    // Por simplicidad, aquí sólo saltamos
                }
            }

            $success = "Routine updated successfully.";
        }
    } elseif ($action === 'delete') {
        $id = $_POST['routine_id'] ?? null;

        if ($id) {
            // Eliminar ejercicios primero por clave foránea
            $stmt = $pdo->prepare("DELETE FROM routine_exercises WHERE routine_id = ?");
            $stmt->execute([$id]);

            $stmt = $pdo->prepare("DELETE FROM routines WHERE id = :id");
            $stmt->execute([':id' => $id]);

            $success = "Routine deleted.";
        } else {
            $error = "Routine ID is required.";
        }
    }

    header("Location: ../editar_rutinas.php?user_id=" . urlencode($_POST['user_id']));
    exit;
}
?>
