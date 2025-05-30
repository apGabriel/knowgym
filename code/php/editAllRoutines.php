<?php
include 'db/check_session.php';
include 'db/db.php';
include 'db/editAllRoutines.logic.php'; // Nueva lógica centralizada

if (!$is_logged_in || !$isAdmin) {
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KnowGYM - Edit Routines</title>
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/style-editAllRoutines.css" />
    <link rel="icon" href="../../img/logo-wings.ico" type="image/x-icon" />
</head>

<body>
    <?php include 'common/header.php'; ?>

    <main>
        <section class="edit-muscle-container">
            <h1>Routine Management</h1>

            <form method="GET" id="userSelectForm" style="margin-bottom: 20px;">
                <label for="userSelect">Select a user:</label>
                <select name="user_id" id="userSelect" onchange="document.getElementById('userSelectForm').submit()">
                    <option value="">-- Select a user --</option>
                    <?php foreach ($users as $user): ?>
                        <option value="<?= $user['id'] ?>" <?= $selected_user_id == $user['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($user['username']) . ' - ' . htmlspecialchars($user['email']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </form>

            <?php if ($error): ?>
                <p style="color:red"><?= htmlspecialchars($error) ?></p>
            <?php elseif ($success): ?>
                <p style="color:green"><?= htmlspecialchars($success) ?></p>
            <?php endif; ?>

            <?php if (!$selected_user_id): ?>
                <p>Please select a user to view their routines.</p>
            <?php elseif (!empty($routines)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($routines as $routine): ?>
                            <tr>
                                <td><?= htmlspecialchars($routine['name']) ?></td>
                                <td>
                                    <button class="edit-btn" onclick="openEditModal(<?= $routine['id'] ?>, '<?= htmlspecialchars(addslashes($routine['name'])) ?>')">Edit</button>
                                    <form method="POST" style="display:inline;">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="routine_id" value="<?= $routine['id'] ?>">
                                        <input type="hidden" name="user_id" value="<?= $selected_user_id ?>">
                                        <button type="submit" class="delete-btn" onclick="return confirm('Delete this routine?')">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No routines registered for this user.</p>
            <?php endif; ?>
        </section>
    </main>

    <!-- Modal for editing routine -->
    <div id="editModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close" onclick="closeEditModal()">&times;</span>
            <h3>Edit Routine</h3>
            <form method="POST" id="editRoutineForm">
                <input type="hidden" name="action" value="edit">
                <input type="hidden" name="routine_id" id="modal_routine_id">
                <input type="hidden" name="user_id" value="<?= $selected_user_id ?>">

                <label for="modal_title">Routine Name:</label>
                <input type="text" id="modal_title" name="title" required>

                <br><br>

                <div id="routineExercisesContainer">
                    <h4>Exercises in this Routine:</h4>
                    <div id="routineExercisesWrapper">
                        <!-- Aquí se inyectan los ejercicios con inputs para sets, reps, duración, etc. -->
                    </div>

                    <button type="button" id="addExerciseBtn">Add Exercise</button>
                </div>

                <br>

                <button type="submit" class="save-btn">Save Changes</button>
            </form>
        </div>
    </div>

    <!-- Modal para añadir ejercicio -->
    <div id="addExerciseModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close" id="closeAddExerciseModal">&times;</span>
            <h3>Add Exercise to Routine</h3>

            <label for="muscle-select">Select Muscle Group:</label>
            <select id="muscle-select">
                <option value="">-- Select a Muscle Group --</option>
            </select>

            <div id="exercises-list" style="margin-top: 10px;">
                <!-- Ejercicios aparecerán aquí -->
            </div>

            <button id="addSelectedExercise" disabled>Add Selected Exercise</button>
        </div>
    </div>

    <script>
        // Mapa con ejercicios actuales para cargar en el modal editar
        const routineExercisesMap = <?= json_encode($routineExercises) ?>;
        const routines = <?= json_encode($routines) ?>;
    </script>
    <script src="../js/edit-allRoutines.js"></script>

</body>

</html>
