<?php
include 'db/check_session.php';
include 'db/db.php';

if (!$is_logged_in || !$isAdmin) {
    header("Location: index.php");
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, email, isAdmin FROM users");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KnowGYM - Edit Users</title>
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/style-editProfile.css" />
    <link rel="icon" href="../../img/logo-wings.ico" type="image/x-icon" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</head>

<body>
    <?php include 'common/header.php'; ?>

    <main>
        <section class="hero">
            <h1>User Management Panel</h1>

            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?= htmlspecialchars($user['username']) ?></td>
                            <td><?= htmlspecialchars($user['email']) ?></td>
                            <td><?= $user['isAdmin'] ? 'Yes' : 'No' ?></td>
                            <td>
                                <a href="#" class="edit-btn"
                                   data-id="<?= $user['id'] ?>"
                                   data-username="<?= htmlspecialchars($user['username']) ?>"
                                   data-email="<?= htmlspecialchars($user['email']) ?>"
                                   data-admin="<?= $user['isAdmin'] ?>">Edit</a>
                                <?php if ($user['id'] != $_SESSION['user_id']): ?>
                                    <a href="db/deleteUser.php?id=<?= $user['id'] ?>" onclick="return confirm('Are you sure?');">Delete</a>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <div id="editModal" class="modal hidden">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Edit User</h2>
                    <form id="editForm">
                        <input type="hidden" name="id" id="edit-id" />

                        <label for="edit-username">Username:</label>
                        <input type="text" name="username" id="edit-username" required />

                        <label for="edit-email">Email:</label>
                        <input type="email" name="email" id="edit-email" required />

                        <label>
                            <input type="checkbox" name="isAdmin" id="edit-admin" />
                            Is Admin
                        </label>

                        <label for="edit-password">New Password:</label><br />
                        <div class="password-wrapper" style="position: relative; display: inline-block; width: 100%;">
                            <input type="password" name="password" id="edit-password" placeholder="Leave blank to keep current" style="padding-right: 30px; width: 100%;" />
                            <i class="fas fa-eye-slash password-toggle" id="toggleEditPassword" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); cursor: pointer;"></i>
                        </div><br /><br />

                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>

        </section>
    </main>

    <?php include 'common/footer.php'; ?>
    <script src="../js/edit-user.js"></script>
    <script>
        // Toggle para mostrar/ocultar contraseña y cambiar icono
        const togglePassword = document.getElementById('toggleEditPassword');
        const passwordInput = document.getElementById('edit-password');

        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            if (type === 'text') {
                togglePassword.classList.remove('fa-eye-slash');
                togglePassword.classList.add('fa-eye');
            } else {
                togglePassword.classList.remove('fa-eye');
                togglePassword.classList.add('fa-eye-slash');
            }
        });
    </script>

</body>

</html>