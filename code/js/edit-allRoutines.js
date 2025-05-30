function openEditModal(routineId, routineName) {
    document.getElementById('editModal').style.display = 'block';
    document.getElementById('modal_routine_id').value = routineId;
    document.getElementById('modal_title').value = routineName;

    const wrapper = document.getElementById('routineExercisesWrapper');
    wrapper.innerHTML = '';

    const exercises = routineExercisesMap[routineId] || [];

    exercises.forEach(ex => {
        addExerciseCard(
            ex.exercise_id,       // id del ejercicio
            ex.exercise_name || '',
            ex.sets ?? 0,
            ex.reps ?? 0,
            ex.duration ?? 0
        );
    });
}


function addExerciseCard(exerciseId = '', exerciseName = '', sets = 0, reps = 0, duration = 0) {
    const wrapper = document.getElementById('routineExercisesWrapper');

    // Crear contenedor
    const div = document.createElement('div');
    div.className = 'exercise-entry';

    // Crear select músculo
    const muscleSelect = document.createElement('select');
    muscleSelect.name = 'muscle[]';
    muscleSelect.className = 'muscle-select';
    muscleSelect.style.marginRight = '6px';
    // Añadimos opciones músculo desde muscleGroupsMap keys
    const muscleKeys = Object.keys(muscleGroupsMap);
    muscleKeys.forEach(muscle => {
        const opt = document.createElement('option');
        opt.value = muscle;
        opt.textContent = muscle;
        muscleSelect.appendChild(opt);
    });

    // Crear select ejercicio
    const exerciseSelect = document.createElement('select');
    exerciseSelect.name = 'exercise_id[]';
    exerciseSelect.className = 'exercise-select';
    exerciseSelect.style.marginRight = '6px';

    // Crear input sets
    const setsLabel = document.createElement('label');
    setsLabel.textContent = 'Sets:';
    setsLabel.style.fontSize = '0.75rem';
    setsLabel.style.marginRight = '2px';

    const setsInput = document.createElement('input');
    setsInput.type = 'number';
    setsInput.name = 'sets[]';
    setsInput.className = 'sets-input';
    setsInput.min = 1;
    setsInput.value = sets;
    setsInput.style.width = '45px';
    setsInput.style.fontSize = '0.8rem';
    setsInput.style.marginRight = '4px';

    // Select modo (reps o duración)
    const modeSelect = document.createElement('select');
    modeSelect.name = 'mode[]';
    modeSelect.className = 'mode-select';
    modeSelect.style.fontSize = '0.8rem';
    modeSelect.style.marginRight = '4px';

    const optionReps = document.createElement('option');
    optionReps.value = 'reps';
    optionReps.textContent = 'Reps';
    modeSelect.appendChild(optionReps);

    const optionDuration = document.createElement('option');
    optionDuration.value = 'duration';
    optionDuration.textContent = 'Sec';
    modeSelect.appendChild(optionDuration);

    // Inputs reps y duration
    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.name = 'reps[]';
    repsInput.className = 'reps-input';
    repsInput.min = 1;
    repsInput.placeholder = 'Reps';
    repsInput.value = reps;
    repsInput.style.width = '50px';
    repsInput.style.fontSize = '0.8rem';
    repsInput.style.marginRight = '4px';

    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.name = 'duration[]';
    durationInput.className = 'duration-input';
    durationInput.min = 1;
    durationInput.placeholder = 'Sec';
    durationInput.value = duration;
    durationInput.style.width = '50px';
    durationInput.style.fontSize = '0.8rem';
    durationInput.style.marginRight = '4px';

    // Botón eliminar ejercicio
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '0.8rem';
    deleteBtn.textContent = 'x';
    deleteBtn.onclick = () => div.remove();

    // Insertamos elementos en el div
    div.appendChild(muscleSelect);
    div.appendChild(exerciseSelect);
    div.appendChild(setsLabel);
    div.appendChild(setsInput);
    div.appendChild(modeSelect);
    div.appendChild(repsInput);
    div.appendChild(durationInput);
    div.appendChild(deleteBtn);

    wrapper.appendChild(div);

    // Función para actualizar ejercicios cuando cambia músculo
    function updateExerciseOptions(selectedMuscle) {
        exerciseSelect.innerHTML = '';
        if (!muscleGroupsMap[selectedMuscle]) return;

        muscleGroupsMap[selectedMuscle].forEach(ex => {
            const opt = document.createElement('option');
            opt.value = ex.id;
            opt.textContent = ex.name;
            exerciseSelect.appendChild(opt);
        });
    }

    // Detectar músculo actual para seleccionar el correcto
    let selectedMuscle = muscleKeys.find(muscle => {
        return muscleGroupsMap[muscle].some(e => e.name === exerciseName);
    }) || muscleKeys[0];
    muscleSelect.value = selectedMuscle;

    updateExerciseOptions(selectedMuscle);

    // Seleccionar el ejercicio correspondiente si existe
    if (exerciseId) {
        exerciseSelect.value = exerciseId;
    } else {
        // Si no hay id, intentar seleccionar por nombre
        const opt = Array.from(exerciseSelect.options).find(o => o.text === exerciseName);
        if(opt) exerciseSelect.value = opt.value;
    }

    // Manejar cambio músculo para actualizar ejercicios
    muscleSelect.addEventListener('change', () => {
        updateExerciseOptions(muscleSelect.value);
        // Opcional: seleccionar primer ejercicio del músculo
        exerciseSelect.selectedIndex = 0;
    });

    // Mostrar/ocultar reps y duration según modo
    function updateModeUI() {
        if (modeSelect.value === 'reps') {
            repsInput.style.display = 'inline-block';
            durationInput.style.display = 'none';
            durationInput.value = 0;
        } else {
            repsInput.style.display = 'none';
            repsInput.value = 0;
            durationInput.style.display = 'inline-block';
        }
    }

    // Seleccionar modo inicial basado en valores
    if (reps > 0) {
        modeSelect.value = 'reps';
    } else if (duration > 0) {
        modeSelect.value = 'duration';
    } else {
        modeSelect.value = 'reps'; // default
    }
    updateModeUI();

    modeSelect.addEventListener('change', updateModeUI);
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Opcional: cerrar modal si se hace clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}