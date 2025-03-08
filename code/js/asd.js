const muscles = [
    "Traps", "Front Shoulders", "Chest", "Biceps", "Forearms", "Obliques", "Abdominals",
    "Quads", "Rear Shoulders", "Traps Middle", "Lats", "Triceps", "Lower Back", "Glutes",
    "Hamstrings", "Calves"
];

function updateSuggestions(str) {
    const dataList = document.getElementById("muscle-list");
    dataList.innerHTML = ""; // Limpiar sugerencias previas
    
    if (str.length === 0) return;
    
    const query = str.toLowerCase();
    const filteredMuscles = muscles.filter(muscle => muscle.toLowerCase().includes(query));
    
    filteredMuscles.forEach(muscle => {
        const option = document.createElement("option");
        option.value = muscle;
        dataList.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("fname");
    if (input) {
        input.addEventListener("input", (event) => {
            updateSuggestions(event.target.value);
        });
    }
});
