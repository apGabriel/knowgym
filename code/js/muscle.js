let exercisesByMuscle = {}; // Objeto que contendrá los ejercicios dinámicamente
let exerciseDetails = {}; // Objeto para almacenar detalles de los ejercicios (GIF y descripción)

// Función para cargar los datos de los músculos desde la base de datos
function loadMuscles() {
    fetch('db/getMuscles.php')
        .then(response => response.ok ? response : fetch('../php/db/getMuscles.php'))
        .then(response => response.json())
        .then(data => {
            data.forEach(muscle => {
                exercisesByMuscle[muscle.muscle_name] = JSON.parse(muscle.exercises);
            });
        })
        .catch(error => console.error('Error al cargar los músculos:', error));
}

// Función para cargar detalles de los ejercicios (GIF y descripción)
function loadExerciseDetails() {
    fetch('db/getExerciseDetails.php') // Nuevo endpoint para obtener detalles
        .then(response => response.json())
        .then(data => {
            data.forEach(exercise => {
                exerciseDetails[exercise.name] = {
                    gif: exercise.gif,
                    description: exercise.description
                };
            });
        })
        .catch(error => console.error('Error al cargar detalles de los ejercicios:', error));
}

// Cargar los datos cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    loadMuscles();
    loadExerciseDetails(); // Carga los detalles de los ejercicios

    // Manejo del buscador
    const input = document.getElementById("fname");
    if (input) {
        input.addEventListener("keyup", (event) => showHint(event.target.value));
        input.addEventListener("change", () => {
            const selectedMuscle = input.value;
            if (Object.keys(exercisesByMuscle).includes(selectedMuscle)) {
                showExercises(selectedMuscle);
            }
        });
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const selectedMuscle = input.value;
                if (Object.keys(exercisesByMuscle).includes(selectedMuscle)) {
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
        });
    });

    // Evento para cerrar el modal
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
        listItem.textContent = exercise;
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

    if (exerciseDetails[exercise]) {
        modalTitle.textContent = exercise;
        modalGif.src = exerciseDetails[exercise].gif;
        modalDesc.textContent = exerciseDetails[exercise].description;
        modal.style.display = "block";
    } else {
        console.error("No hay información disponible para este ejercicio.");
    }
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById("exercise-modal").style.display = "none";
}
