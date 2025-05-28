document.getElementById("open-routine-modal").addEventListener("click", openUnifiedRoutineModal);
let selectedExercises = {}; // Ejercicios seleccionados por grupo muscular
let tempSelectedExercises = {}; // Ejercicios seleccionados temporalmente en el modal
let isEditMode = false;

function openUnifiedRoutineModal(isManager) {
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
            <h2 id="routine-modal-title">${isManager ? "Manage Routines" : "Create Routine"}</h2>
            <div id="routine-mode-switch">
                <button id="create-routine-mode" class="mode-btn">Create</button>
                <button id="edit-routine-mode" class="mode-btn">Manage</button>
            </div>
            <div id="routine-form-section"></div>
        </div>
    `;

    modal.style.display = "block";

    document.querySelector(".close-routine").addEventListener("click", () => {
        if(isEditMode){
            renderManageRoutines()
        }else{
            modal.style.display = "none";
        }
    });

    document.getElementById("create-routine-mode").addEventListener("click", () => {
        renderCreateRoutineForm();
        document.getElementById("routine-modal-title").textContent = "Create Routine"; // Cambia el título a "Create Routine"
    });

    document.getElementById("edit-routine-mode").addEventListener("click", () => {
        renderManageRoutines();
        document.getElementById("routine-modal-title").textContent = "Manage Routines"; // Cambia el título a "Manage Routines"
    });

    // Muestra el modo por defecto
    isManager ? renderManageRoutines() : renderCreateRoutineForm();
}

function renderCreateRoutineForm() {
    isEditMode = false;
    selectedExercises = {};

    const container = document.getElementById("routine-form-section");
    document.getElementById("routine-modal-title").textContent = "Create Routine";

    container.innerHTML = `
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
    `;

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

    document.getElementById("save-routine").addEventListener("click", () => {
        const routineName = document.getElementById("routine-name").value.trim();

        if (!routineName) {
            alert("Please enter a name for the routine.");
            return;
        }

        if (Object.keys(selectedExercises).length === 0) {
            alert("Please select at least one exercise.");
            return;
        }

        const exercises = [];
        Object.entries(selectedExercises).forEach(([muscle, list]) => {
            list.forEach(exercise => {
                exercises.push({ muscle, exercise });
            });
        });

        const data = {
            routine_name: routineName,
            exercises: exercises
        };

        fetch("db/saveRoutine.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                alert("Routine saved successfully!");
                document.getElementById("routine-modal").style.display = "none";
                selectedExercises = {};
                loadUserRoutines();
            } else {
                alert("Error saving routine: " + response.message);
            }
        })
        .catch(error => {
            console.error("Error saving routine:", error);
            alert("An error occurred while saving.");
        });
    });
}


function renderManageRoutines() {
    isEditMode = false;
    const container = document.getElementById("routine-form-section");
    document.getElementById("routine-modal-title").textContent = "Manage Routine";

    container.innerHTML = `
        <div class="search" style="display: flex; justify-content: center; width: 100%; margin-bottom: 1rem;">
            <form action="" style="width: 100%;">
                <input 
                    type="text" 
                    id="routine-search" 
                    name="routine-search" 
                    list="routine-list" 
                    placeholder="Search routine:"
                    style="width: 100%; padding: 0.5rem; font-size: 1rem; box-sizing: border-box;"
                >
                <datalist id="routine-list"></datalist>
            </form>
        </div>
        
        <div id="user-routines-container">Loading routines...</div>
    `;

    fetch("db/getUserRoutines.php")
        .then(response => response.json())
        .then(data => {
            const routinesContainer = document.getElementById("user-routines-container");
            routinesContainer.innerHTML = "";

            const datalist = document.getElementById("routine-list");
            data.forEach(routine => {
                const option = document.createElement("option");
                option.value = routine.routine_name;
                datalist.appendChild(option);
            });

            data.forEach(routine => {
                const routineDiv = document.createElement("div");
                routineDiv.classList.add("routine-block");

                const titleRow = document.createElement("div");
                titleRow.classList.add("routine-header");

                const title = document.createElement("h4");
                title.textContent = routine.routine_name;
                title.classList.add("routine-name");

                const btnGroup = document.createElement("div");
                btnGroup.classList.add("routine-buttons");

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.classList.add("edit-button");

                editBtn.addEventListener("click", () => {
                    fetch("db/getUserRoutines.php")
                        .then(res => res.json())
                        .then(data => {
                            const details = data.find(r => r.routine_id === routine.routine_id);
                            if (!details) {
                                alert("Rutina no encontrada.");
                                return;
                            }

                            isEditMode = true;
                            selectedExercises = {};

                            details.exercises.forEach(({ muscle, exercises }) => {
                                if (!selectedExercises[muscle]) selectedExercises[muscle] = [];

                                exercises.forEach(exercise => {
                                    selectedExercises[muscle].push({
                                        exercise_id: exercise.exercise_id,
                                        exercise_name: exercise.exercise_name,
                                        sets: exercise.sets ?? 3,
                                        reps: exercise.reps ?? 12,
                                        duration: exercise.duration ?? 60
                                    });
                                });
                            });


                            const container = document.getElementById("routine-form-section");
                            document.getElementById("routine-modal-title").textContent = "Edit Routine";
                            container.innerHTML = `
                                <label for="routine-name">Routine Name:</label>
                                <input type="text" id="routine-name" value="${routine.routine_name}">
                                <label for="muscle-select">Select Muscle Group:</label>
                                <select id="muscle-select">
                                    <option value="">-- Select a Muscle Group --</option>
                                </select>
                                <h3>Selected Exercises:</h3>
                                <div id="selected-exercises-container"></div>
                                <div class="modal-buttons">
                                    <button id="update-routine">Update</button>
                                </div>
                            `;

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
                                });

                            muscleSelect.addEventListener("change", function () {
                                if (this.value) openExerciseModal(this.value);
                            });

                            updateSelectedExercises();

                            document.getElementById("update-routine").addEventListener("click", () => {
                                const routineName = document.getElementById("routine-name").value.trim();
                                if (!routineName) return alert("Please enter a name for the routine.");
                                if (Object.keys(selectedExercises).length === 0) return alert("Please select at least one exercise.");

                                let wrapperIndex = 0;
                                const allWrappers = document.querySelectorAll(".exercise-entry");
                                                                
                                Object.entries(selectedExercises).forEach(([muscle, list]) => {
                                    list.forEach(ex => {
                                        const wrapper = allWrappers[wrapperIndex];
                                        if (!wrapper) return;
                                        const setsInput = wrapper.querySelector(".sets-input");
                                        const repsInput = wrapper.querySelector(".reps-input");
                                        const durationInput = wrapper.querySelector(".duration-input");

                                        ex.sets = setsInput ? parseInt(setsInput.value) || 3 : 3;
                                        ex.reps = repsInput && repsInput.value !== "" ? parseInt(repsInput.value) : null;
                                        ex.duration = durationInput && durationInput.value !== "" ? parseInt(durationInput.value) : null;
                                        wrapperIndex++;
                                    });
                                });

                                const exercises = [];
                                Object.values(selectedExercises).forEach(list => exercises.push(...list));

                                const data = {
                                    routine_id: routine.routine_id,
                                    routine_name: routineName,
                                    exercises: exercises
                                };

                                fetch("db/updateRoutine.php", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(data)
                                })
                                    .then(res => res.json())
                                    .then(response => {
                                        if (response.success) {
                                            alert("Routine updated successfully!");
                                            fetch("db/getUserRoutines.php")
                                                .then(res => res.json())
                                                .then(routines => {
                                                    renderManageRoutines(routines);
                                                });
                                                loadUserRoutines()
                                        } else {
                                            alert("Error updating routine: " + response.message);
                                        }
                                    })
                                    .catch(err => {
                                        console.error("Update failed:", err);
                                        alert("An error occurred while updating.");
                                    });
                            });
                        })
                        .catch(err => {
                            console.error("Error fetching routine details:", err);
                            alert("Failed to load routine details.");
                        });
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.classList.add("delete-button");
                deleteBtn.addEventListener("click", () => {
                    const confirmDelete = confirm(`Are you sure you want to delete the routine "${routine.routine_name}"?`);
                    if (!confirmDelete) return;

                    const payload = JSON.stringify({ routine_id: routine.routine_id });

                    fetch("db/deleteRoutine.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: payload
                    })
                        .then(res => res.text())
                        .then(response => {
                            try {
                                const jsonResponse = JSON.parse(response);
                                if (jsonResponse.success) {
                                    alert("Routine deleted successfully.");
                                    renderManageRoutines();
                                    loadUserRoutines();
                                } else {
                                    alert("Failed to delete routine: " + jsonResponse.message);
                                }
                            } catch (e) {
                                console.error("Error parsing response:", e);
                                alert("Error: Unable to parse server response.");
                            }
                        })
                        .catch(err => {
                            console.error("Error deleting routine:", err);
                            alert("An error occurred while deleting the routine.");
                        });
                });

                btnGroup.appendChild(editBtn);
                btnGroup.appendChild(deleteBtn);

                titleRow.appendChild(title);
                titleRow.appendChild(btnGroup);
                routineDiv.appendChild(titleRow);

                routinesContainer.appendChild(routineDiv);
            });

            // FILTRO DE BÚSQUEDA DINÁMICO
            const searchInput = document.getElementById("routine-search");
            searchInput.addEventListener("input", function () {
                const query = this.value.toLowerCase();
                const routineBlocks = document.querySelectorAll(".routine-block");

                routineBlocks.forEach(block => {
                    const name = block.querySelector(".routine-name").textContent.toLowerCase();
                    block.style.display = name.includes(query) ? "block" : "none";
                });
            });
        })
        .catch(err => {
            console.error("Error fetching routines:", err);
            const routinesContainer = document.getElementById("user-routines-container");
            routinesContainer.innerHTML = "Failed to load routines.";
        });
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
                // Detectar si el ejercicio ya está seleccionado
                let isSelected = false;

                if (isEditMode) {
                    // tempSelectedExercises contiene objetos con exercise_name
                    isSelected = tempSelectedExercises[muscleName]?.some(e => e.exercise_name === exercise.name);
                } else {
                    // tempSelectedExercises es array de strings
                    isSelected = tempSelectedExercises[muscleName]?.includes(exercise.name);
                }

                exerciseHtml += `
                    <div class='exercise-item ${isSelected ? "selected" : ""}' data-exercise='${exercise.name}' data-muscle='${muscleName}'>
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
                    const exerciseName = this.getAttribute("data-exercise");

                    if (!tempSelectedExercises[muscle]) {
                        tempSelectedExercises[muscle] = [];
                    }

                    if (isEditMode) {
                        // tempSelectedExercises es array de objetos {exercise_name,...}
                        const index = tempSelectedExercises[muscle].findIndex(e => e.exercise_name === exerciseName);

                        if (index > -1) {
                            // Ya está seleccionado: eliminarlo
                            tempSelectedExercises[muscle].splice(index, 1);
                            this.classList.remove("selected");
                        } else {
                            // No está seleccionado: fetch para obtener exercise_id y añadir
                            fetch(`db/getExerciseIdByName.php?name=${encodeURIComponent(exerciseName)}`)
                                .then(res => res.json())
                                .then(data => {
                                    const exerciseId = data.exercise_id ?? null;
                                    tempSelectedExercises[muscle].push({
                                        exercise_id: exerciseId,
                                        exercise_name: exerciseName,
                                        sets: 3,
                                        reps: 12,
                                        duration: 60
                                    });
                                    this.classList.add("selected");
                                })
                                .catch(err => {
                                    console.error("Error al obtener exercise_id", err);
                                    // Agregar sin ID si falla
                                    tempSelectedExercises[muscle].push({
                                        exercise_id: null,
                                        exercise_name: exerciseName,
                                        sets: 3,
                                        reps: 12,
                                        duration: 60
                                    });
                                    this.classList.add("selected");
                                });
                        }
                    } else {
                        // Modo creación: tempSelectedExercises es array de strings
                        if (tempSelectedExercises[muscle].includes(exerciseName)) {
                            tempSelectedExercises[muscle] = tempSelectedExercises[muscle].filter(e => e !== exerciseName);
                            this.classList.remove("selected");
                        } else {
                            tempSelectedExercises[muscle].push(exerciseName);
                            this.classList.add("selected");
                        }
                    }
                });
            });

            document.getElementById("select-exercises").addEventListener("click", () => {
                // Guardar selección temporal en global y actualizar UI
                selectedExercises[muscleName] = [...(tempSelectedExercises[muscleName] || [])];
                updateSelectedExercisesEdit(); // o updateSelectedExercises según el modo
                modal.style.display = "none";
            });
        })
        .catch(error => console.error("Error fetching exercises:", error));
}


function updateSelectedExercises() {
    if (isEditMode) {
        updateSelectedExercisesEdit();
    } else {
        updateSelectedExercisesCreate();
    }
}

function updateSelectedExercisesCreate() {
    const container = document.getElementById("selected-exercises-container");
    if (!container) return;

    // 1. Guardar el estado expandido de los grupos musculares
    const expandedGroups = {};
    container.querySelectorAll(".muscle-group").forEach(group => {
        const h4 = group.querySelector("h4");
        const groupName = h4?.textContent?.replace(/[▲▼]/g, "").trim();
        const ol = group.querySelector("ol");
        if (ol && ol.style.maxHeight && ol.style.maxHeight !== "0px") {
            expandedGroups[groupName] = true;
        }
    });

    container.innerHTML = "";

    Object.keys(selectedExercises).forEach(muscleGroup => {
        if (selectedExercises[muscleGroup].length > 0) {
            const muscleSection = document.createElement("div");
            muscleSection.classList.add("muscle-group");

            const title = document.createElement("h4");
            title.textContent = `${muscleGroup} ▼`;
            muscleSection.appendChild(title);

            const exerciseList = document.createElement("ol");
            exerciseList.style.overflow = "hidden";
            exerciseList.style.transition = "max-height 0.3s ease-out";

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

            // 2. Lógica de abrir/cerrar al hacer clic
            title.addEventListener("click", () => {
                const isCollapsed = exerciseList.style.maxHeight === "0px" || exerciseList.style.maxHeight === "";
                if (isCollapsed) {
                    exerciseList.style.maxHeight = `${exerciseList.scrollHeight}px`;
                    title.textContent = `${muscleGroup} ▲`;
                } else {
                    exerciseList.style.maxHeight = "0";
                    title.textContent = `${muscleGroup} ▼`;
                }
            });

            // 3. Restaurar estado anterior
            if (expandedGroups[muscleGroup]) {
                exerciseList.style.maxHeight = `${exerciseList.scrollHeight}px`;
                title.textContent = `${muscleGroup} ▲`;
            } else {
                exerciseList.style.maxHeight = "0";
                title.textContent = `${muscleGroup} ▼`;
            }
        }
    });
}

function updateSelectedExercisesEdit() {
    const container = document.getElementById("selected-exercises-container");
    if (!container) return;

    const expandedGroups = {};
    container.querySelectorAll(".muscle-group").forEach(group => {
        const h4 = group.querySelector("h4");
        const groupName = h4?.textContent?.replace(/[▲▼]/g, "").trim();
        const list = group.querySelector(".exercise-list");
        if (list && list.style.maxHeight && list.style.maxHeight !== "0px") {
            expandedGroups[groupName] = true;
        }
    });

    container.innerHTML = "";

    Object.entries(selectedExercises).forEach(([muscle, exercises]) => {
        if (exercises.length === 0) return;

        const muscleDiv = document.createElement("div");
        muscleDiv.classList.add("muscle-group");

        const title = document.createElement("h4");
        title.textContent = `${muscle} ▼`;
        muscleDiv.appendChild(title);

        const list = document.createElement("div");
        list.classList.add("exercise-list");
        list.style.overflow = "hidden";
        list.style.transition = "max-height 0.3s ease-out";

        exercises.forEach((exercise, index) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("exercise-entry");
        
            const nameSpan = document.createElement("span");
            nameSpan.classList.add("exercise-name");
            nameSpan.textContent = exercise.exercise_name || exercise;
            nameSpan.style.fontSize = "0.85rem";
            nameSpan.style.marginRight = "6px";
        
            const setsLabel = document.createElement("label");
            setsLabel.textContent = "Sets:";
            setsLabel.style.fontSize = "0.75rem";
            setsLabel.style.marginRight = "2px";
        
            const setsInput = document.createElement("input");
            setsInput.type = "number";
            setsInput.classList.add("sets-input");
            setsInput.value = exercise.sets ?? 3;
            setsInput.min = 1;
            setsInput.style.width = "45px";
            setsInput.style.fontSize = "0.8rem";
            setsInput.style.marginRight = "4px";
        
            const modeSelect = document.createElement("select");
            modeSelect.classList.add("mode-select");
            modeSelect.style.fontSize = "0.8rem";
            modeSelect.style.marginRight = "4px";
        
            const repsInput = document.createElement("input");
            repsInput.type = "number";
            repsInput.classList.add("reps-input");
            repsInput.value = exercise.reps ?? "";
            repsInput.min = 1;
            repsInput.placeholder = "Reps";
            repsInput.style.width = "50px";
            repsInput.style.fontSize = "0.8rem";
            repsInput.style.marginRight = "4px";
        
            const durationInput = document.createElement("input");
            durationInput.type = "number";
            durationInput.classList.add("duration-input");
            durationInput.value = exercise.duration ?? "";
            durationInput.min = 1;
            durationInput.placeholder = "Sec";
            durationInput.style.width = "50px";
            durationInput.style.fontSize = "0.8rem";
            durationInput.style.marginRight = "4px";
        
            // Definir modo desde base de datos
            const modeFromData = exercise.reps !== null ? "reps" : (exercise.duration !== null ? "duration" : "reps");
        
            ["reps", "duration"].forEach(opt => {
                const option = document.createElement("option");
                option.value = opt;
                option.textContent = opt === "reps" ? "Reps" : "Sec";
                if (opt === modeFromData) option.selected = true;
                modeSelect.appendChild(option);
            });
        
            if (modeFromData === "reps") {
                repsInput.style.display = "inline-block";
                durationInput.style.display = "none";
            } else {
                repsInput.style.display = "none";
                durationInput.style.display = "inline-block";
            }
        
            modeSelect.addEventListener("change", () => {
                const mode = modeSelect.value;
                if (mode === "reps") {
                    repsInput.style.display = "inline-block";
                    durationInput.style.display = "none";
                    selectedExercises[muscle][index].duration = null;
                    durationInput.value = "";
                } else {
                    repsInput.style.display = "none";
                    durationInput.style.display = "inline-block";
                    selectedExercises[muscle][index].reps = null;
                    repsInput.value = "";
                }
            });
        
            repsInput.addEventListener("input", () => {
                const val = parseInt(repsInput.value);
                selectedExercises[muscle][index].reps = val > 0 ? val : 12;
            });
        
            durationInput.addEventListener("input", () => {
                const val = parseInt(durationInput.value);
                selectedExercises[muscle][index].duration = val > 0 ? val : 60;
            });
        
            setsInput.addEventListener("input", () => {
                const val = parseInt(setsInput.value);
                selectedExercises[muscle][index].sets = val > 0 ? val : 3;
            });
        
            const removeButton = document.createElement("button");
            removeButton.id = "delete-exercise";
            removeButton.textContent = "x";
            removeButton.style.cursor = "pointer";
            removeButton.style.fontSize = "0.8rem";
        
            removeButton.addEventListener("click", () => {
                selectedExercises[muscle].splice(index, 1);
                if (selectedExercises[muscle].length === 0) {
                    delete selectedExercises[muscle];
                }
                updateSelectedExercisesEdit();
            });
        
            // Si no es modo edición, esconder elementos
            if (!isEditMode) {
                setsLabel.style.display = "none";
                setsInput.style.display = "none";
                modeSelect.style.display = "none";
                repsInput.style.display = "none";
                durationInput.style.display = "none";
            }
        
            wrapper.appendChild(nameSpan);
            wrapper.appendChild(setsLabel);
            wrapper.appendChild(setsInput);
            wrapper.appendChild(modeSelect);
            wrapper.appendChild(repsInput);
            wrapper.appendChild(durationInput);
            wrapper.appendChild(removeButton);
            list.appendChild(wrapper);
        });
        

        muscleDiv.appendChild(list);
        container.appendChild(muscleDiv);

        title.addEventListener("click", () => {
            const isCollapsed = list.style.maxHeight === "0px" || list.style.maxHeight === "";
            list.style.maxHeight = isCollapsed ? `${list.scrollHeight}px` : "0";
            title.textContent = `${muscle} ${isCollapsed ? "▲" : "▼"}`;
        });

        if (expandedGroups[muscle]) {
            list.style.maxHeight = `${list.scrollHeight}px`;
            title.textContent = `${muscle} ▲`;
        } else {
            list.style.maxHeight = "0";
            title.textContent = `${muscle} ▼`;
        }
    });
}

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