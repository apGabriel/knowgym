<?php include 'db/check_session.php'; ?>
<?php include 'db/process_contact.php'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Us - KnowGYM</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/style-contact.css">
    <link rel="icon" href="../../img/logo-wings.ico" type="image/x-icon">
</head>

<body>
    <?php include 'common/header.php'; ?>

    <main>
        <section class="form-container">
            <div class="form-box">
                <h2>Contact Us</h2>
                <p>If you have any questions, feel free to send us a message.</p>

                <?php if (!empty($successMessage)) : ?>
                    <p class="success-message"><?php echo $successMessage; ?></p>
                <?php endif; ?>
                <?php if (!empty($errorMessage)) : ?>
                    <p class="error-message"><?php echo $errorMessage; ?></p>
                <?php endif; ?>

                <form  method="POST">
                    <div class="input-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" placeholder="Enter your name" required>
                    </div>

                    <div class="input-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required>
                    </div>

                    <div class="input-group">
                        <label for="message">Message:</label>
                        <textarea id="message" name="message" rows="5" placeholder="Write your message here" required></textarea>
                    </div>

                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
    </main>

    <?php include 'common/footer.php'; ?>
</body>

</html>
