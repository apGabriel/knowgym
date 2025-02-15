function showForm(formType) {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-form').classList.remove('active');

    if (formType === 'login') {
        document.getElementById('login-form').classList.add('active');
    } else if (formType === 'register') {
        document.getElementById('register-form').classList.add('active');
    }
}

function submitForm(event, formType) {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(event.target);
    const phpScript = formType === 'login' ? '../php/db/login.php' : '../php/db/register.php';

    fetch(phpScript, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Success: ${data.message}`);
            // Redirect or perform other actions
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
    });
}

// Handle the "form" parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const formType = urlParams.get('form') || 'login'; // Default to login form
showForm(formType);

// Add event listeners to the forms
document.getElementById('login-form').querySelector('form').addEventListener('submit', (event) => submitForm(event, 'login'));
document.getElementById('register-form').querySelector('form').addEventListener('submit', (event) => submitForm(event, 'register'));
