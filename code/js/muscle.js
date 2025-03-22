let exercisesByMuscle = {}; // Objeto que contendrá los ejercicios dinámicamente

// Función para cargar los datos de los músculos desde la base de datos
function loadMuscles() {
    fetch('db/getMuscles.php')
        .then(response => response.json())
        .then(data => {
           
            data.forEach(muscle => {
                exercisesByMuscle[muscle.muscle_name] = muscle.exercises;
            });
        })
        .catch(error => console.error('Error al cargar los músculos:', error));
}

// Cargar los datos cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    loadMuscles();

    // Manejo del buscador
    const input = document.getElementById("fname");
    if (input) {
        input.addEventListener("keyup", (event) => showHint(event.target.value));
        input.addEventListener("change", () => {
            const selectedMuscle = input.value;
            if (exercisesByMuscle[selectedMuscle]) {
                showExercises(selectedMuscle);
            }
        });
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const selectedMuscle = input.value;
                if (exercisesByMuscle[selectedMuscle]) {
                    showExercises(selectedMuscle);
                }
            }
        });
    }

    // Manejo de clics en el SVG de músculos
    document.querySelectorAll('path[data-muscle]').forEach(path => {
        path.addEventListener('click', () => {
            const muscle = path.getAttribute('data-muscle');
            showExercises(muscle);
            closeModal();
        });
    });

    // Evento para cerrar el modal al hacer clic en el botón de cerrar
    document.querySelector(".close").addEventListener("click", closeModal);

});

// Función para mostrar sugerencias en el input
function showHint(str) {
    const datalist = document.getElementById("muscle-list");
    datalist.innerHTML = "";
    if (str.length === 0) return;

    const query = str.toLowerCase();
    Object.keys(exercisesByMuscle).forEach(muscle => {
        if (muscle.toLowerCase().includes(query)) {
            const option = document.createElement("option");
            option.value = muscle;
            datalist.appendChild(option);
        }
    });
}

// Función para mostrar los ejercicios de un músculo seleccionado
function showExercises(muscle) {
    const exerciseList = exercisesByMuscle[muscle] || [];
    const container = document.querySelector('.exercise-list');

    container.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = `Ejercicios para ${muscle}`;
    container.appendChild(title);

    const list = document.createElement('ul');
    exerciseList.forEach(exercise => {
        const listItem = document.createElement('li');
        listItem.textContent = exercise.name;
        listItem.addEventListener("click", () => openExerciseModal(exercise)); // Abre modal al hacer clic
        list.appendChild(listItem);
    });
    container.appendChild(list);
}

// Función para abrir el modal con detalles del ejercicio
function openExerciseModal(exercise) {
    const modal = document.getElementById("exercise-modal");
    const modalTitle = document.getElementById("exercise-title");
    const modalGif = document.getElementById("exercise-gif");
    const modalDesc = document.getElementById("exercise-description");

    modalTitle.textContent = exercise.name;
    modalGif.src = exercise.gif;
    modalDesc.textContent = exercise.description;
    modal.style.display = "block";
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById("exercise-modal").style.display = "none";
}
