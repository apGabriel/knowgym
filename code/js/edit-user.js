// Manejador de apertura del modal
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('edit-id').value = this.dataset.id;
        document.getElementById('edit-username').value = this.dataset.username;
        document.getElementById('edit-email').value = this.dataset.email;
        document.getElementById('edit-admin').checked = this.dataset.admin === "1";
        document.getElementById('editModal').classList.remove('hidden');
    });
});

// Cerrar modal
document.querySelector('.modal .close').addEventListener('click', () => {
    document.getElementById('editModal').classList.add('hidden');
});

// Envío del formulario
document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('db/updateUser.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log(data); // para ver si todo va bien
        location.reload(); // recargar la página tras guardar cambios
    })
    .catch(err => {
        console.error('Error:', err);
    });
});
