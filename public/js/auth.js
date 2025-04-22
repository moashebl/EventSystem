// auth.js - Handles authentication state across pages

// Check if user is logged in
function checkAuthStatus() {
    fetch('/api/profile')
        .then(response => {
            if (response.ok) {
                // User is logged in
                document.querySelectorAll('.user-logged-in').forEach(el => {
                    el.style.display = 'block';
                });
                document.querySelectorAll('.user-not-logged-in').forEach(el => {
                    el.style.display = 'none';
                });
                return response.json();
            } else {
                // User is not logged in
                document.querySelectorAll('.user-logged-in').forEach(el => {
                    el.style.display = 'none';
                });
                document.querySelectorAll('.user-not-logged-in').forEach(el => {
                    el.style.display = 'block';
                });
                throw new Error('Not authenticated');
            }
        })
        .catch(error => {
            console.log('Authentication check error:', error);
        });
}

// Handle logout
function setupLogout() {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            fetch('/api/logout')
                .then(response => response.json())
                .then(data => {
                    console.log(data.message);
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                });
        });
    }
}

// Initialize auth features
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupLogout();
});
