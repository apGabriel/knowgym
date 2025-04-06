document.querySelector(".rutine").addEventListener("click", () => openRoutineModal(false));
document.querySelector(".rutine-manager").addEventListener("click", () => openRoutineModal(true));

let selectedExercises = {}; // Almacena ejercicios seleccionados por grupo muscular
let tempSelectedExercises = {}; // Almacena temporalmente los ejercicios seleccionados

function openRoutineModal(isManager) {
    let modal = document.getElementById("routine-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "routine-modal";
        modal.classList.add("modal");
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-routine">&times;</span>
            <h2>${isManager ? "Manage Routines" : "Create Routine"}</h2>
            <label for="routine-name">Routine Name:</label>
            <input type="text" id="routine-name" placeholder="Enter routine name">

            <label for="muscle-select">Select Muscle Group:</label>
            <select id="muscle-select">
                <option value="">-- Select a Muscle Group --</option>
            </select>

            <h3>Selected Exercises:</h3>
            <div id="selected-exercises-container"></div>

            <div class="modal-buttons">
                <button id="save-routine">Save</button>
            </div>
        </div>
    `;

    modal.style.display = "block";

    document.querySelector(".close-routine").addEventListener("click", () => {
        modal.style.display = "none";
    });

    const muscleSelect = document.getElementById("muscle-select");

    fetch("db/getMuscles.php")
        .then(response => response.json())
        .then(data => {
            data.forEach(muscle => {
                const option = document.createElement("option");
                option.value = muscle.muscle_name;
                option.textContent = muscle.muscle_name;
                muscleSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching muscles:", error));

    muscleSelect.addEventListener("change", function () {
        if (this.value) {
            openExerciseModal(this.value);
        }
    });

    updateSelectedExercises();
}

function openExerciseModal(muscleName) {
    let modal = document.getElementById("exercise-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "exercise-modal";
        modal.classList.add("modal");
        document.body.appendChild(modal);
    }

    fetch("db/getMuscles.php")
        .then(response => response.json())
        .then(data => {
            const muscleData = data.find(m => m.muscle_name === muscleName);
            if (!muscleData || !muscleData.exercises.length) {
                alert("No exercises found for this muscle group.");
                return;
            }

            tempSelectedExercises[muscleName] = [...(selectedExercises[muscleName] || [])];

            let exerciseHtml = `
                <div class='modal-content'>
                    <span class='close-exercise'>&times;</span>
                    <h2>Exercises for ${muscleName}</h2>
                    <div class='exercise-grid'>
            `;

            muscleData.exercises.forEach(exercise => {
                const isSelected = tempSelectedExercises[muscleName]?.includes(exercise.name) ? "selected" : "";
                exerciseHtml += `
                    <div class='exercise-item ${isSelected}' data-exercise='${exercise.name}' data-muscle='${muscleName}'>
                        <img src='${exercise.gif}' alt='${exercise.name}' width='50'>
                        <p>${exercise.name}</p>
                    </div>
                `;
            });

            exerciseHtml += `
                    </div>
                    <button id='select-exercises'>Select Exercises</button>
                </div>
            `;

            modal.innerHTML = exerciseHtml;
            modal.style.display = "block";

            document.querySelector(".close-exercise").addEventListener("click", () => {
                modal.style.display = "none";
            });

            document.querySelectorAll(".exercise-item").forEach(item => {
                item.addEventListener("click", function () {
                    const muscle = this.getAttribute("data-muscle");
                    const exercise = this.getAttribute("data-exercise");

                    if (!tempSelectedExercises[muscle]) {
                        tempSelectedExercises[muscle] = [];
                    }

                    if (tempSelectedExercises[muscle].includes(exercise)) {
                        tempSelectedExercises[muscle] = tempSelectedExercises[muscle].filter(e => e !== exercise);
                        this.classList.remove("selected");
                    } else {
                        tempSelectedExercises[muscle].push(exercise);
                        this.classList.add("selected");
                    }
                });
            });

            document.getElementById("select-exercises").addEventListener("click", () => {
                selectedExercises[muscleName] = [...(tempSelectedExercises[muscleName] || [])];
                updateSelectedExercises();
                modal.style.display = "none";
            });
        })
        .catch(error => console.error("Error fetching exercises:", error));
}

function updateSelectedExercises() {
    const container = document.getElementById("selected-exercises-container");
    if (!container) return;

    container.innerHTML = ""; 

    Object.keys(selectedExercises).forEach(muscleGroup => {
        if (selectedExercises[muscleGroup].length > 0) {
            const muscleSection = document.createElement("div");
            muscleSection.classList.add("muscle-group");

            const title = document.createElement("h4");
            title.textContent = `${muscleGroup}▼`;
            muscleSection.appendChild(title);

            const exerciseList = document.createElement("ol");

            selectedExercises[muscleGroup].forEach((exercise, index) => {
                const listItem = document.createElement("li");
                listItem.textContent = exercise;

                const removeButton = document.createElement("button");
                removeButton.textContent = "x";
                removeButton.style.marginLeft = "10px";
                removeButton.style.cursor = "pointer";

                removeButton.addEventListener("click", () => {
                    selectedExercises[muscleGroup].splice(index, 1);
                    if (selectedExercises[muscleGroup].length === 0) {
                        delete selectedExercises[muscleGroup]; 
                    }
                    updateSelectedExercises();
                });

                listItem.appendChild(removeButton);
                exerciseList.appendChild(listItem);
            });

            muscleSection.appendChild(exerciseList);
            container.appendChild(muscleSection);

            // Hacer que las listas estén comprimidas por defecto
            title.addEventListener("click", () => {
                const exerciseList = muscleSection.querySelector("ol");
                if (exerciseList.style.maxHeight === '0px' || exerciseList.style.maxHeight === '') {
                    exerciseList.style.maxHeight = `${exerciseList.scrollHeight}px`; // Expande la lista a su altura total
                    title.textContent = `${muscleGroup} ▲`; // Cambiar el ícono a ▲ cuando se expande
                } else {
                    exerciseList.style.maxHeight = '0'; // Contrae la lista
                    title.textContent = `${muscleGroup} ▼`; // Cambiar el ícono a ▼ cuando se contrae
                }
            });
        }
    });
}
