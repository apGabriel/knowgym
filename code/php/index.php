<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KnowGYM - Your Sports Agenda</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" href="../../img/logo-wings.ico" type="image/x-icon">
</head>
<body>
    <?php include 'common/header.php'; ?>
    <section class="hero">
        <h1>KnowGYM</h1>
        <p>Your sports agenda</p>
        <div class="buttons">
            <button id="calendar-btn">Calendar</button>
            <button onclick="window.location.href='muscle.php'">Muscular Groups</button>
        </div>
        <p id="calendar-warning" class="hidden">⚠️ Login is required to access the calendar</p>
    </section>

    <section class="image-banner">
    <picture>
        <source srcset="../../img/sentenses-movil.jpg" media="(max-width: 440px)">
        <img src="../../img/sentenses.jpg" alt="No Pain, No Gain">
    </picture>
    </section>

    <section class="why-section">
        <h2>Why did we decide to create this website?</h2>
        <p>Whe know that, for many people maintaining a consistent and varied routine at the gym can be a challenge. Lack of organization, uncertainty about which exercises to perform, or simply the lack of practical tools to plan their workouts are common problems we wanted to solve.</p>
        <p>With our platform, we aim to empower each user to take control of their own progress by offering an intuitive and functional tool that suits both beginners and advanced athletes.</p>
        <p>Our website is not just a tool, it's your companion on the path to your fitness goals. We believe in the power of planning as the key to success, and we are committed to providing you with everything you need to make the most out of every workout.</p>
        <p>We invite you to discover how our platform can make a difference in your daily routine and help you take your performance to the next level.</p>
    </section>

    <?php include 'common/footer.php'; ?>

    <script src="../js/enable_calendar.js"></script>

</body>
</html>
