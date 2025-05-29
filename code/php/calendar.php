<?php
include 'db/check_session.php';

if (!$is_logged_in) {
    header("Location: index.php");
    exit;
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KnowGYM - Calendar</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/style-calendar.css">
    <link rel="icon" href="../../img/logo-wings.ico" type="image/x-icon">
</head>

<body>
    <?php include 'common/header.php'; ?>

    <div class="calendar">
        <div class="calendar-header">
            <button id="prev-month" class="nav-btn">◀</button>
            <span id="calendar-header"></span>
            <button id="next-month" class="nav-btn">▶</button>
        </div>
        <div class="calendar-body">
            <div class="day">Sun</div>
            <div class="day">Mon</div>
            <div class="day">Tue</div>
            <div class="day">Wed</div>
            <div class="day">Thu</div>
            <div class="day">Fri</div>
            <div class="day">Sat</div>
        </div>
    </div>

    <!-- Modal for managing events -->
    <div id="event-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Manage Routine</h2>
            <p id="selected-date"></p>
            <select id="event-text" placeholder="Enter your plan..."></select>
            <div class="manage-event">
                <div class="time-inputs">
                    <label for="start-time">Start Time:</label>
                    <input type="time" id="start-time">
                    <label for="end-time">End Time:</label>
                    <input type="time" id="end-time">
                </div>
                <div class="routine-exercises"> </div>

            </div>
            <div class="modal-buttons">
                <button id="save-event">Save</button>
                <button id="delete-event" style="display: none;">Delete</button>
            </div>
        </div>
    </div>

    <div class="buttons">
        <button id="open-routine-modal">Routines</button>
    </div>


    <?php include 'common/footer.php'; ?>
    <script src="../js/script-calendar.js"></script>
    <script src="../js/script-routines.js"></script>
</body>

</html>