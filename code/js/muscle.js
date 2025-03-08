const exercisesByMuscle = {
    "Traps": [
        "Dumbbell shrugs",
        "Barbell shrugs",
        "Barbell upright row",
        "Machine shrugs",
        "Cable shrugs"
    ],
    "Front Shoulders": [
        "Overhead barbell press",
        "Dumbbell front raises",
        "Push press",
        "Arnold press",
        "Plate front raises"
    ],
    "Chest": [
        "Barbell bench press",
        "Incline dumbbell press",
        "Dumbbell flyes",
        "Decline barbell press",
        "Dips"
    ],
    "Biceps": [
        "Barbell curl",
        "Alternating dumbbell curl",
        "Hammer curl",
        "Preacher curl",
        "Concentration curl"
    ],
    "Forearms": [
        "Barbell wrist curl",
        "Reverse barbell wrist curl",
        "Farmer's walk",
        "Dumbbell wrist extension",
        "Isometric plate hold"
    ],
    "Obliques": [
        "Russian twists",
        "Side plank",
        "Hanging oblique leg raises",
        "Dumbbell side bends",
        "Barbell twist"
    ],
    "Abdominals": [
        "Floor crunch",
        "Hanging leg raises",
        "Front plank",
        "Ab wheel rollout",
        "Mountain climbers"
    ],
    "Quads": [
        "Barbell squats",
        "Leg press",
        "Dumbbell lunges",
        "Leg extensions",
        "Bulgarian split squats"
    ],
    "Rear Shoulders": [
        "Dumbbell rear delt fly",
        "Cable face pull",
        "Rear delt machine fly",
        "Dumbbell bent-over row",
        "Resistance band reverse fly"
    ],
    "Traps Middle": [
        "Barbell row",
        "Machine row",
        "T-bar row",
        "Face pulls",
        "Barbell shrugs"
    ],
    "Lats": [
        "Pull-ups",
        "Lat pulldown",
        "Low pulley row",
        "Dumbbell pull-over",
        "Pronated barbell row"
    ],
    "Triceps": [
        "Triceps cable extensions",
        "French press",
        "Dips",
        "Dumbbell triceps kickback",
        "Overhead dumbbell extensions"
    ],
    "Lower Back": [
        "Conventional deadlift",
        "Hyperextensions",
        "Good mornings",
        "Superman exercise",
        "Barbell row"
    ],
    "Glutes": [
        "Hip thrust",
        "Glute bridges",
        "Deep squats",
        "Lunges",
        "Hip abduction machine"
    ],
    "Hamstrings": [
        "Romanian deadlift",
        "Leg curl",
        "Good mornings",
        "Hamstring-focused hip thrust",
        "Reverse lunges"
    ],
    "Calves": [
        "Standing calf raises",
        "Seated calf raises",
        "Calf raises on leg press",
        "Jump rope",
        "Tiptoe walk"
    ]
};

const muscles = Object.keys(exercisesByMuscle);

function showHint(str) {
    const datalist = document.getElementById("muscle-list");
    datalist.innerHTML = "";
    if (str.length === 0) return;

    const query = str.toLowerCase();
    muscles.forEach(muscle => {
        if (muscle.toLowerCase().includes(query)) {
            const option = document.createElement("option");
            option.value = muscle;
            datalist.appendChild(option);
        }
    });
}

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
        list.appendChild(listItem);
    });
    container.appendChild(list);
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("fname");
    if (input) {
        input.addEventListener("keyup", (event) => {
            showHint(event.target.value);
        });
        
        input.addEventListener("change", () => {
            const selectedMuscle = input.value;
            if (muscles.includes(selectedMuscle)) {
                showExercises(selectedMuscle);
            }
        });

        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const selectedMuscle = input.value;
                if (muscles.includes(selectedMuscle)) {
                    showExercises(selectedMuscle);
                }
            }
        });
    }

    const musclePaths = document.querySelectorAll('path[data-muscle]');
    musclePaths.forEach(path => {
        path.addEventListener('click', () => {
            const muscle = path.getAttribute('data-muscle');
            showExercises(muscle);
        });
    });
});
