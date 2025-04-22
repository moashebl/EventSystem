// dashboard.js - Handles functionality for the user dashboard page

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkUserAuthentication();
    
    // Fetch user profile and registered events
    fetchUserProfile();
    fetchUserEvents();
});

// Check if user is authenticated, redirect if not
function checkUserAuthentication() {
    fetch('/api/profile')
        .then(response => {
            if (!response.ok) {
                // User is not logged in, redirect to login page
                window.location.href = '/login';
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Authentication error:', error);
        });
}

// Fetch user profile information
function fetchUserProfile() {
    fetch('/api/profile')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            return response.json();
        })
        .then(user => {
            displayUserProfile(user);
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            document.getElementById('profile-info').innerHTML = `
                <div class="alert alert-danger">
                    Failed to load profile information. Please try again later.
                </div>
            `;
        });
}

// Display user profile information
function displayUserProfile(user) {
    const profileInfoContainer = document.getElementById('profile-info');
    
    profileInfoContainer.innerHTML = `
        <div class="mb-3">
            <strong>Name:</strong> ${user.name}
        </div>
        <div class="mb-3">
            <strong>Email:</strong> ${user.email}
        </div>
        <div class="mb-3">
            <strong>Events Registered:</strong> ${user.registeredEvents.length}
        </div>
    `;
}

// Fetch user's registered events
function fetchUserEvents() {
    fetch('/api/user/events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user events');
            }
            return response.json();
        })
        .then(events => {
            displayUserEvents(events);
        })
        .catch(error => {
            console.error('Error fetching user events:', error);
            document.getElementById('user-events').innerHTML = `
                <div class="alert alert-danger">
                    Failed to load registered events. Please try again later.
                </div>
            `;
        });
}

// Display user's registered events
function displayUserEvents(events) {
    const userEventsContainer = document.getElementById('user-events');
    
    if (events.length === 0) {
        userEventsContainer.innerHTML = `
            <div class="alert alert-info">
                You haven't registered for any events yet. 
                <a href="/events">Browse events</a> to find something interesting!
            </div>
        `;
        return;
    }
    
    let eventsHTML = '<div class="row">';
    
    events.forEach(event => {
        eventsHTML += `
            <div class="col-md-6 mb-4">
                <div class="card event-card">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="bi bi-calendar"></i> ${event.date} at ${event.time}
                            </small>
                        </p>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="bi bi-geo-alt"></i> ${event.location}
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        `;
    });
    
    eventsHTML += '</div>';
    userEventsContainer.innerHTML = eventsHTML;
}
