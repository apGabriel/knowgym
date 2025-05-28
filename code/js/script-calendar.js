const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const currentDate = today.getDate();

const calendarHeader = document.getElementById("calendar-header");
const calendarBody = document.querySelector(".calendar-body");
const modal = document.getElementById("event-modal");
const closeModal = document.querySelector(".close");
const saveEventButton = document.getElementById("save-event");
const deleteEventButton = document.getElementById("delete-event");
const selectedDateText = document.getElementById("selected-date");
const eventText = document.getElementById("event-text");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Store events
let events = {};
let eventDates = [];

// Function to generate calendar
function generateCalendar(month, year) {
    calendarHeader.textContent = `${months[month]} ${year}`;

    const dates = document.querySelectorAll(".date");
    dates.forEach((date) => date.remove());

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("date", "empty");
        calendarBody.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement("div");
        dateCell.classList.add("date");
        dateCell.textContent = day;

        if (day === currentDate && month === today.getMonth() && year === today.getFullYear()) {
            dateCell.classList.add("today");
        }

        const formattedDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        // Si el día tiene un evento, agregar el indicador
        if (eventDates.includes(formattedDate)) {
            const eventIndicator = document.createElement("span");
            eventIndicator.classList.add("event-indicator");
            eventIndicator.title = "You have a saved routine";
            dateCell.appendChild(eventIndicator);
        }

        dateCell.addEventListener("click", () => openModal(day, month, year));
        calendarBody.appendChild(dateCell);
    }
}


function loadEventDates() {
    return fetch("db/getUserEventDates.php")
        .then(res => res.json())
        .then(data => {
            eventDates = data || [];
        })
        .catch(err => {
            console.error("Error loading event dates:", err);
            eventDates = [];
        });
}


// Open modal for managing routines
function openModal(day, month, year) {
    const eventDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    modal.style.display = "block";
    selectedDateText.textContent = `Date: ${months[month]} ${day}, ${year}`;

    // Reset values
    eventText.value = "";
    startTimeInput.value = "";
    endTimeInput.value = "";
    deleteEventButton.style.display = "none";
    document.querySelector(".routine-exercises").innerHTML = "";

    fetch(`db/getRoutineEventByDate.php?date=${eventDate}`)
        .then(res => res.json())
        .then(event => {
            if (!event) return;

            // Set values
            eventText.value = event.routine_id;
            startTimeInput.value = event.start_time;
            endTimeInput.value = event.end_time;
            deleteEventButton.style.display = "inline-block";

            const container = document.querySelector(".routine-exercises");

            event.exercises.forEach(group => {
                const muscleDiv = document.createElement("div");
                muscleDiv.classList.add("muscle-group");

                const title = document.createElement("h4");
                title.textContent = `${group.muscle} ▼`;
                title.style.cursor = "pointer";

                const list = document.createElement("div");
                list.classList.add("exercise-list");
                list.style.overflow = "hidden";
                list.style.maxHeight = "0";
                list.style.transition = "max-height 0.3s ease-out";

                group.exercises.forEach(ex => {
                    const item = document.createElement("p");
                    const detail = ex.reps !== null
                        ? `${ex.sets} sets x ${ex.reps} reps`
                        : `${ex.sets} sets x ${ex.duration} sec`;
                    item.textContent = `• ${ex.exercise_name} (${detail})`;
                    list.appendChild(item);
                });

                title.addEventListener("click", () => {
                    const isCollapsed = list.style.maxHeight === "0px" || list.style.maxHeight === "";
                    list.style.maxHeight = isCollapsed ? `${list.scrollHeight}px` : "0";
                    title.textContent = `${group.muscle} ${isCollapsed ? "▲" : "▼"}`;
                });

                muscleDiv.appendChild(title);
                muscleDiv.appendChild(list);
                container.appendChild(muscleDiv);
            });
        })
        .catch(err => {
            console.error("Error loading event:", err);
        });
}



// Cargar rutinas del usuario en el select del modal
function loadUserRoutines() {
    fetch("db/getUserRoutines.php")
        .then(res => res.json())
        .then(data => {
            const routineSelect = document.getElementById("event-text");
            routineSelect.innerHTML = "<option value=''>-- Select a Routine --</option>";

            if (data.error) {
                console.error("Error al cargar rutinas:", data.error);
                return;
            }

            data.forEach(routine => {
                const option = document.createElement("option");
                option.value = routine.routine_id;
                option.textContent = routine.routine_name;
                routineSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Error en la petición de rutinas:", err);
        });
}

// Llamar al cargar la página
loadUserRoutines();

// Mostrar ejercicios al seleccionar una rutina
document.getElementById("event-text").addEventListener("change", function () {
    const routineId = this.value;
    const container = document.querySelector(".routine-exercises");
    container.innerHTML = "";

    if (!routineId) return;

    fetch("db/getUserRoutines.php")
        .then(res => res.json())
        .then(data => {
            const routine = data.find(r => r.routine_id == routineId);
            if (!routine) return;

            routine.exercises.forEach(group => {
                const title = document.createElement("h4");
                title.textContent = group.muscle;
                container.appendChild(title);

                group.exercises.forEach(ex => {
                    const item = document.createElement("p");
                    const detail = ex.reps !== null
                        ? `${ex.sets} sets x ${ex.reps} reps`
                        : `${ex.sets} sets x ${ex.duration}s`;

                    item.textContent = `• ${ex.exercise_name} (${detail})`;
                    container.appendChild(item);
                });
            });
        })
        .catch(err => {
            console.error("Error al cargar detalles de rutina:", err);
        });
});


// Close modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Save event
saveEventButton.addEventListener("click", () => {
    const selectedDate = selectedDateText.textContent.split(": ")[1];
    const [monthName, day, year] = selectedDate.split(" ");
    const monthIndex = months.indexOf(monthName);
    const eventDate = `${year}-${(monthIndex + 1).toString().padStart(2, "0")}-${parseInt(day).toString().padStart(2, "0")}`;

    const routineId = eventText.value.trim();
    const startTime = startTimeInput.value.trim();
    const endTime = endTimeInput.value.trim();

    if (!routineId || !startTime || !endTime) {
        alert("Please select a routine and time range.");
        return;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (endTotalMinutes <= startTotalMinutes) {
        alert("End time must be later than start time.");
        return;
    }

    // Obtener detalles de la rutina seleccionada para enviar los ejercicios también
    fetch("db/getUserRoutines.php")
        .then(res => res.json())
        .then(routines => {
            const routine = routines.find(r => r.routine_id == routineId);
            if (!routine) {
                alert("Selected routine not found.");
                return;
            }

            const eventData = {
                routine_id: routineId,
                event_date: eventDate,
                start_time: startTime,
                end_time: endTime,
                exercises: [] // Se llenará abajo
            };

            routine.exercises.forEach(group => {
                group.exercises.forEach(ex => {
                    eventData.exercises.push({
                        exercise_id: ex.exercise_id,
                        sets: ex.sets,
                        reps: ex.reps,
                        duration: ex.duration
                    });
                });
            });

            // Enviar al backend
            fetch("db/saveRoutineEvent.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(eventData)
            })
                .then(res => res.json())
                .then(response => {
                    if (response.success) {
                        alert("Routine saved to calendar!");
                        modal.style.display = "none";
                        loadEventDates().then(() => generateCalendar(currentMonth, currentYear));
                    } else {
                        alert("Error saving routine: " + response.message);
                    }
                })
                .catch(err => {
                    console.error("Request error:", err);
                    alert("Something went wrong while saving the event.");
                });
        });
});


// Delete event
deleteEventButton.addEventListener("click", () => {
    const selectedDate = selectedDateText.textContent.split(": ")[1];
    const [monthName, day, year] = selectedDate.split(" ");
    const monthIndex = months.indexOf(monthName);
    const eventDate = `${year}-${(monthIndex + 1).toString().padStart(2, "0")}-${parseInt(day).toString().padStart(2, "0")}`;

    if (!confirm("Are you sure you want to delete this event?")) return;

    fetch("db/deleteRoutineEvent.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_date: eventDate })
    })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                alert("Event deleted successfully.");
                modal.style.display = "none";
                loadEventDates().then(() => generateCalendar(currentMonth, currentYear));
            } else {
                alert("Failed to delete event: " + response.message);
            }
        })
        .catch(err => {
            console.error("Error deleting event:", err);
            alert("An error occurred while deleting.");
        });
});


const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

// Función para cambiar de mes
prevMonthButton.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadEventDates().then(() => generateCalendar(currentMonth, currentYear));
});

nextMonthButton.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadEventDates().then(() => generateCalendar(currentMonth, currentYear));
});

// Initialize calendar
loadEventDates().then(() => {
    generateCalendar(currentMonth, currentYear);
});
