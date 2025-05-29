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
                    <th>Username</th><th>Email</th><th>Admin</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($users as $user): ?>
                <tr>
                    <td><?= htmlspecialchars($user['username']) ?></td>
                    <td><?= htmlspecialchars($user['email']) ?></td>
                    <td><?= $user['isAdmin'] ? 'Yes' : 'No' ?></td>
                    <td>
                        <a href="editUser.php?id=<?= $user['id'] ?>">Edit</a>
                        <a href="deleteUser.php?id=<?= $user['id'] ?>" onclick="return confirm('Are you sure?');">Delete</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </section>
</main>

<?php include 'common/footer.php'; ?>
</body>
</html>
