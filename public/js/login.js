// login.js - Handles functionality for the login page

document.addEventListener('DOMContentLoaded', function() {
    // Set up login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    // Get form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Client-side validation
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';
    
    if (!email || !password) {
        showAlert('Email and password are required', 'danger');
        return;
    }
    
    // Send login request to server
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        showAlert('Login successful! Redirecting to dashboard...', 'success');
        // Redirect to dashboard after successful login
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);
    })
    .catch(error => {
        console.error('Login error:', error);
        showAlert(error.message || 'Login failed. Please check your credentials and try again.', 'danger');
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
