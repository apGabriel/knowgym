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
        <img src="../../img/sentenses.jpg" alt="No Pain, No Gain">
    </section>

    <section class="why-section">
        <h2>¿Por qué hemos decidido crear esta página?</h2>
        <p>Sabemos que, para muchas personas, mantener una rutina constante y variada en el gimnasio puede ser un desafío. Falta de organización, incertidumbre sobre qué ejercicios realizar o simplemente la falta de herramientas prácticas para planificar sus entrenamientos, son problemas comunes que queríamos resolver.</p>
        <p>Con nuestra plataforma, buscamos empoderar a cada usuario para que tome el control de su propio progreso, ofreciendo una herramienta intuitiva y funcional que se adapte tanto a principiantes como a deportistas avanzados.</p>
        <p>Nuestra web no es solo una herramienta, es tu compañera en el camino hacia tus metas deportivas. Creemos en el poder de la planificación como clave para el éxito, y estamos comprometidos a ofrecerte todo lo necesario para que aproveches al máximo cada entrenamiento.</p>
        <p>Te invitamos a descubrir cómo nuestra plataforma puede marcar la diferencia en tu rutina diaria y ayudarte a llevar tu rendimiento al siguiente nivel.</p>
    </section>

    <?php include 'common/footer.php'; ?>

    <script src="../js/enable_calendar.js"></script>

</body>
</html>
