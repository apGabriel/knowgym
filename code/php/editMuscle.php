<?php
/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);*/

include 'db/check_session.php';
include 'db/db.php';

if (!$is_logged_in || !$isAdmin) {
    header("Location: index.php");
    exit;
}

$error = '';
$selectedMuscleId = $_POST['muscle_id'] ?? null;

// Cargar músculos
try {
    $stmt = $pdo->prepare("SELECT id, muscle_name FROM muscles ORDER BY muscle_name");
    $stmt->execute();
    $muscles = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error cargando músculos: " . $e->getMessage());
}

// Función para validar extensión de archivo gif/webp
function isValidGifOrWebp($filename)
{
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return in_array($ext, ['gif', 'webp']);
}

// Procesar acciones
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'edit') {
        $exercise_id = $_POST['exercise_id'];
        $name = trim($_POST['name']);
        $description = trim($_POST['description']);
        $gif_current = $_POST['gif_current'] ?? '';

        $gif_path = $gif_current; // Por defecto, la imagen actual

        // Procesar subida archivo nuevo si existe
        if (isset($_FILES['gif']) && $_FILES['gif']['error'] === UPLOAD_ERR_OK) {
            $uploadedFileName = $_FILES['gif']['name'];

            if (!isValidGifOrWebp($uploadedFileName)) {
                $error = "Sólo se permiten archivos .gif o .webp para el GIF.";
            } else {
                // Obtener muscle_id del ejercicio para la carpeta
                $stmt = $pdo->prepare("SELECT muscle_id FROM exercises WHERE id = ?");
                $stmt->execute([$exercise_id]);
                $muscle_id_for_edit = $stmt->fetchColumn();

                $stmt = $pdo->prepare("SELECT muscle_name FROM muscles WHERE id = ?");
                $stmt->execute([$muscle_id_for_edit]);
                $muscleName = $stmt->fetchColumn();

                $muscleFolder = strtolower($muscleName);
                $muscleFolder = preg_replace('/[^a-z0-9]+/', '', $muscleFolder);

                $uploadDir = __DIR__ . "/../../img/exercises-gif/$muscleFolder/";
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }

                // Renombrar archivo para evitar colisiones, ej: timestamp_nombreoriginal.gif
                $ext = strtolower(pathinfo($uploadedFileName, PATHINFO_EXTENSION));
                $safeName = preg_replace('/[^a-zA-Z0-9-_]/', '_', pathinfo($uploadedFileName, PATHINFO_FILENAME));
                $newFileName = time() . "_" . $safeName . "." . $ext;
                $targetPath = $uploadDir . $newFileName;

                if (move_uploaded_file($_FILES['gif']['tmp_name'], $targetPath)) {
                    $gif_path = "$muscleFolder/$newFileName";
                } else {
                    $error = "Error al mover el archivo subido para edición.";
                }
            }
        }

        if (!$error) {
            if ($name && $gif_path && $description) {
                $stmt = $pdo->prepare("UPDATE exercises SET name = :name, gif = :gif, description = :description WHERE id = :id");
                $stmt->execute([
                    ':name' => $name,
                    ':gif' => $gif_path,
                    ':description' => $description,
                    ':id' => $exercise_id
                ]);
            } else {
                $error = "Todos los campos son obligatorios para editar.";
            }
        }
    } elseif ($action === 'delete') {
        $exercise_id = $_POST['exercise_id'] ?? null;
        if ($exercise_id) {
            $stmt = $pdo->prepare("DELETE FROM exercises WHERE id = :id");
            $stmt->execute([':id' => $exercise_id]);
        }
    } elseif ($action === 'add') {
        $name = trim($_POST['name']);
        $description = trim($_POST['description']);
        $muscle_id = $_POST['muscle_id'] ?? null;

        if (!$muscle_id) {
            $error = "Debe seleccionar un grupo muscular válido.";
        } elseif (!$name || !$description || !isset($_FILES['gif']) || $_FILES['gif']['error'] !== UPLOAD_ERR_OK) {
            $error = "Todos los campos son obligatorios para agregar un nuevo ejercicio.";
        } else {
            $uploadedFileName = $_FILES['gif']['name'];
            if (!isValidGifOrWebp($uploadedFileName)) {
                $error = "Sólo se permiten archivos .gif o .webp para el GIF.";
            } else {
                // Obtener muscle_name para carpeta
                $stmt = $pdo->prepare("SELECT muscle_name FROM muscles WHERE id = ?");
                $stmt->execute([$muscle_id]);
                $muscleName = $stmt->fetchColumn();

                if (!$muscleName) {
                    $error = "Grupo muscular inválido.";
                } else {
                    $muscleFolder = strtolower($muscleName);
                    $muscleFolder = preg_replace('/[^a-z0-9]+/', '', $muscleFolder);

                    $uploadDir = __DIR__ . "/../../img/exercises-gif/$muscleFolder/";
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }

                    // Renombrar archivo para evitar colisiones
                    $ext = strtolower(pathinfo($uploadedFileName, PATHINFO_EXTENSION));
                    $safeName = preg_replace('/[^a-zA-Z0-9-_]/', '_', pathinfo($uploadedFileName, PATHINFO_FILENAME));
                    $newFileName = time() . "_" . $safeName . "." . $ext;
                    $targetPath = $uploadDir . $newFileName;

                    if (move_uploaded_file($_FILES['gif']['tmp_name'], $targetPath)) {
                        $gif_path = "$muscleFolder/$newFileName";

                        // Insertar nuevo ejercicio
                        $stmt = $pdo->prepare("INSERT INTO exercises (muscle_id, name, gif, description) VALUES (:muscle_id, :name, :gif, :description)");
                        $stmt->execute([
                            ':muscle_id' => $muscle_id,
                            ':name' => $name,
                            ':gif' => $gif_path,
                            ':description' => $description
                        ]);
                    } else {
                        $error = "Error al mover el archivo subido para el nuevo ejercicio.";
                    }
                }
            }
        }
    }
}

// Cargar ejercicios del grupo seleccionado
$exercises = [];
if ($selectedMuscleId) {
    $stmt = $pdo->prepare("SELECT * FROM exercises WHERE muscle_id = :muscle_id ORDER BY name");
    $stmt->execute([':muscle_id' => $selectedMuscleId]);
    $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KnowGYM - Edit Exercises</title>
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/style-editMuscle.css" />
    <link rel="icon" href="../../img/logo-wings.ico" type="image/x-icon" />
</head>

<body>

    <?php include 'common/header.php'; ?>
    <main>
        <section class="edit-muscle-container">

            <h1>Exercise Management</h1>

            <?php if (!empty($error)): ?>
                <p style="color:red"><?= htmlspecialchars($error) ?></p>
            <?php endif; ?>

            <!-- Selector de músculo -->
            <form method="POST">
                <label for="muscle_id">Select a muscular group:</label>
                <select name="muscle_id" id="muscle_id" onchange="this.form.submit()">
                    <option value="">-- Select --</option>
                    <?php foreach ($muscles as $muscle): ?>
                        <option value="<?= $muscle['id'] ?>" <?= $selectedMuscleId == $muscle['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($muscle['muscle_name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <noscript><button type="submit">See exercises</button></noscript>
            </form>

            <?php if ($selectedMuscleId): ?>

                <!-- Tabla de ejercicios -->
                <h2>Exercises of selected group</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>GIF</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($exercises as $exercise): ?>
                            <tr>
                                <form method="POST" enctype="multipart/form-data">
                                    <input type="hidden" name="action" value="edit">
                                    <input type="hidden" name="exercise_id" value="<?= $exercise['id'] ?>">
                                    <input type="hidden" name="muscle_id" value="<?= $selectedMuscleId ?>">

                                    <td><input type="text" name="name" value="<?= htmlspecialchars($exercise['name']) ?>"></td>
                                    <td>
                                        <div class="gif-input-wrapper">
                                            <input type="file" name="gif" accept=".gif,.webp">
                                            <input type="hidden" name="gif_current" value="<?= htmlspecialchars($exercise['gif']) ?>">
                                            <?php if (!empty($exercise['gif'])): ?>
                                                <img class="gif-thumb" src="../../img/exercises-gif/<?= htmlspecialchars($exercise['gif']) ?>" alt="gif actual">
                                            <?php endif; ?>
                                        </div>
                                    </td>

                                    <td><textarea name="description" rows="3"><?= htmlspecialchars($exercise['description']) ?></textarea></td>
                                    <td>
                                        <button type="submit" class="save-btn">Save</button>
                                </form>
                                <form method="POST" style="margin-top: 5px;">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="exercise_id" value="<?= $exercise['id'] ?>">
                                    <input type="hidden" name="muscle_id" value="<?= $selectedMuscleId ?>">
                                    <button type="submit" class="delete-btn" onclick="return confirm('Are you sure to delete this exercise?')">Delete</button>
                                </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>

                <!-- Añadir nuevo ejercicio -->
                <h2>Add new exercise</h2>
                <form method="POST" enctype="multipart/form-data">
                    <input type="hidden" name="action" value="add">
                    <input type="hidden" name="muscle_id" value="<?= $selectedMuscleId ?>">

                    <label>Name:</label>
                    <input type="text" name="name" required>

                    <label>GIF (archivo .gif o .webp):</label>
                    <input type="file" name="gif" id="gifInput" accept=".gif,.webp" required>
                    <div id="gifPreviewContainer" style="margin-top: 10px;">
                        <img id="gifPreview" src="" alt="GIF preview" style="max-width: 100px; max-height: 100px; display: none; padding: 2px; border-radius: 4px;">
                    </div>

                    <label>Description:</label>
                    <textarea name="description" rows="4" required></textarea>

                    <button class="add-btn" type="submit">Add exercise</button>
                </form>

            <?php endif; ?>
        </section>
    </main>

    <?php include 'common/footer.php'; ?>
    <script>
        const gifInput = document.getElementById('gifInput');
        if (gifInput) {
            gifInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                const preview = document.getElementById('gifPreview');

                if (file && (file.type === 'image/gif' || file.type === 'image/webp')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                } else {
                    preview.src = '';
                    preview.style.display = 'none';
                }
            });
        }
    </script>

</body>

</html>