<?php
    include 'db/editUser.logic.php';
    $mensaje = $_GET['msg'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>KnowGYM - Edit User</title>
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/style-editUser.css" />
    <link rel="icon" href="../../img/logo-wings.ico" type="image/x-icon" />
    <!-- Font Awesome para el icono del ojo -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</head>

<body>
    <?php include 'common/header.php'; ?>

    <main>
        <section class="hero">
            <h1>Edit User Information</h1>
            <?php if (!empty($mensaje)) : ?>
                <div class="mensaje-alerta"><?= htmlspecialchars($mensaje) ?></div>
            <?php endif; ?>
            <form method="POST" action="editUser.php">
                <label for="nombre">Name:</label><br/>
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value="<?= htmlspecialchars($usuario['username']) ?>"
                    required/><br/><br/>

                <label for="email">Email:</label><br/>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value="<?= htmlspecialchars($usuario['email']) ?>"
                    required/><br/><br/>

                <label for="password">New Password:</label><br/>
                <div class="password-wrapper" style="position: relative; display: inline-block;">
                    <input type="password" name="password" id="password" style="padding-right: 30px;" />
                    <i class="fas password-toggle fa-eye-slash" id="togglePassword"
                        style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); cursor: pointer;"></i>
                </div><br/><br/>

                <button type="submit">Save Changes</button>
            </form>
        </section>
    </main>

    <?php include 'common/footer.php'; ?>

    <script>
        // Toggle para mostrar/ocultar contraseña y cambiar icono
        const togglePassword = document.querySelector('#togglePassword');
        const passwordInput = document.querySelector('#password');

        togglePassword.addEventListener('click', function() {
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