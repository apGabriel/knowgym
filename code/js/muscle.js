let exercisesByMuscle = {}; // Este será el objeto que contendrá los datos dinámicamente

// Función para cargar los datos de los músculos desde el servidor
function loadMuscles() {
    fetch('db/getMuscles.php') // Llamamos al archivo PHP que obtiene los datos de la base de datos
        .then(response => response.json()) // Parseamos la respuesta como JSON
        .then(data => {
            // Llenamos el objeto exercisesByMuscle con los datos obtenidos
            data.forEach(muscle => {
                exercisesByMuscle[muscle.muscle_name] = JSON.parse(muscle.exercises);
            });
        })
        .catch(error => {
            console.error('Error al cargar los músculos desde la base de datos:', error);
        });
}

// Cargar los músculos cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    loadMuscles(); // Cargamos los músculos y ejercicios desde la base de datos

    // Función para el manejo de la búsqueda
    const input = document.getElementById("fname");
    if (input) {
        input.addEventListener("keyup", (event) => {
            showHint(event.target.value); // Llama a la función de sugerencias
        });

        input.addEventListener("change", () => {
            const selectedMuscle = input.value;
            if (Object.keys(exercisesByMuscle).includes(selectedMuscle)) {
                showExercises(selectedMuscle); // Muestra los ejercicios si se selecciona un músculo válido
            }
        });

        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const selectedMuscle = input.value;
                if (Object.keys(exercisesByMuscle).includes(selectedMuscle)) {
                    showExercises(selectedMuscle); // Muestra los ejercicios si se presiona Enter
                }
            }
        });
    }

    // Manejo de los clics sobre las rutas SVG de músculos
    const musclePaths = document.querySelectorAll('path[data-muscle]');
    musclePaths.forEach(path => {
        path.addEventListener('click', () => {
            const muscle = path.getAttribute('data-muscle');
            showExercises(muscle); // Muestra los ejercicios del músculo al hacer clic en la ruta
        });
    });
});

// Función para mostrar las sugerencias de músculos
function showHint(str) {
    const datalist = document.getElementById("muscle-list");
    datalist.innerHTML = "";
    if (str.length === 0) return;

    const query = str.toLowerCase();
    Object.keys(exercisesByMuscle).forEach(muscle => {
        if (muscle.toLowerCase().includes(query)) {
            const option = document.createElement("option");
            option.value = muscle;
            datalist.appendChild(option); // Agrega sugerencias de músculos a la lista
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
        list.appendChild(listItem); // Agrega cada ejercicio a la lista
    });
    container.appendChild(list);
}
