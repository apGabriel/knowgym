document.querySelector(".rutine").addEventListener("click", () => openRoutineModal(false));
document.querySelector(".rutine-manager").addEventListener("click", () => openRoutineModal(true));

function openRoutineModal(isManager) {
    const existingModal = document.getElementById("routine-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "routine-modal";
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-routine">&times;</span>
            <h2>${isManager ? "Manage Routines" : "Create Routine"}</h2>
            <label for="routine-name">Routine Name:</label>
            <input type="text" id="routine-name" placeholder="Enter routine name">

            <label for="muscle-select">Select Muscle Group:</label>
            <select id="muscle-select"></select>

            <div id="exercise-selection" class="exercise-grid"></div>

            <div class="modal-buttons">
                <button id="save-routine">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    document.querySelector(".close-routine").addEventListener("click", () => modal.remove());

    const muscleSelect = document.getElementById("muscle-select");
    const exerciseSelection = document.getElementById("exercise-selection");

    // Obtener datos de músculos y ejercicios desde PHP
    fetch("db/getMuscles.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(muscle => {
                const option = document.createElement("option");
                option.value = muscle.muscle_name;
                option.textContent = muscle.muscle_name;
                muscleSelect.appendChild(option);
            });

            // Cargar ejercicios cuando cambia la selección del músculo
            muscleSelect.addEventListener("change", () => updateExerciseSelection(data));

            // Cargar primera opción por defecto
            updateExerciseSelection(data);
        });

    function updateExerciseSelection(data) {
        const selectedMuscle = muscleSelect.value;
        const selectedExercises = data.find(m => m.muscle_name === selectedMuscle).exercises || [];
        
        exerciseSelection.innerHTML = "";
        exerciseSelection.classList.toggle("two-columns", selectedExercises.length > 5);

        selectedExercises.forEach((exercise, index) => {
            const div = document.createElement("div");
            div.classList.add("exercise-item");

            div.innerHTML = `
                <input type="checkbox" id="exercise-${index}" value="${exercise.name}">
                <label for="exercise-${index}">
                    <img src="${exercise.gif}" alt="${exercise.name}" width="50">
                    ${exercise.name}
                </label>
            `;

            exerciseSelection.appendChild(div);
        });
    }

    // Guardar rutina
    document.getElementById("save-routine").addEventListener("click", () => {
        const routineName = document.getElementById("routine-name").value.trim();
        const selectedExercises = Array.from(document.querySelectorAll("#exercise-selection input:checked"))
            .map(input => input.value);

        if (!routineName || selectedExercises.length === 0) {
            alert("Please enter a routine name and select at least one exercise.");
            return;
        }

        fetch("save_routine.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: routineName, exercises: selectedExercises })
        }).then(response => response.text())
          .then(result => alert(result));

        modal.remove();
    });

    modal.style.display = "block";
}
