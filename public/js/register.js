// register.js - Handles functionality for the registration page

document.addEventListener('DOMContentLoaded', function() {
    // Set up registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
});

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Client-side validation
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';
    
    if (!name || !email || !password || !confirmPassword) {
        showAlert('All fields are required', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    // Send registration request to server
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Registration failed');
            });
        }
        return response.json();
    })
    .then(data => {
        showAlert('Registration successful! Redirecting to dashboard...', 'success');
        // Redirect to dashboard after successful registration
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);
    })
    .catch(error => {
        console.error('Registration error:', error);
        showAlert(error.message || 'Registration failed. Please try again.', 'danger');
    });
}

// Display alert message
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}
