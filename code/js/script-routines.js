document.querySelector(".rutine").addEventListener("click", () => openRoutineModal(false));
document.querySelector(".rutine-manager").addEventListener("click", () => openRoutineModal(true));

let selectedExercises = {}; // Objeto para almacenar ejercicios por grupo muscular

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

            let exerciseHtml = `
                <div class='modal-content'>
                    <span class='close-exercise'>&times;</span>
                    <h2>Exercises for ${muscleName}</h2>
                    <div class='exercise-grid'>
            `;

            muscleData.exercises.forEach((exercise, index) => {
                exerciseHtml += `
                    <div class='exercise-item'>
                        <input type='checkbox' id='exercise-${index}' value='${exercise.name}'>
                        <label for='exercise-${index}'>
                            <img src='${exercise.gif}' alt='${exercise.name}' width='50'>
                            ${exercise.name}
                        </label>
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

            document.getElementById("select-exercises").addEventListener("click", () => {
                document.querySelectorAll("#exercise-modal input[type='checkbox']:checked").forEach((checkbox) => {
                    if (!selectedExercises[muscleName]) {
                        selectedExercises[muscleName] = [];
                    }
                    selectedExercises[muscleName].push(checkbox.value);
                });

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
            title.textContent = `${muscleGroup}:`;
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
        }
    });
}
