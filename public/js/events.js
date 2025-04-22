// events.js - Handles functionality for the events page

document.addEventListener('DOMContentLoaded', function() {
    // Fetch all events
    fetchEvents();
});

// Fetch events from the server
function fetchEvents() {
    fetch('/api/events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            return response.json();
        })
        .then(events => {
            displayEvents(events);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            document.getElementById('events-container').innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-danger">
                        Failed to load events. Please try again later.
                    </div>
                </div>
            `;
        });
}

// Display events on the events page
function displayEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    
    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>No upcoming events at the moment.</p>
            </div>
        `;
        return;
    }
    
    let eventsHTML = '';
    
    events.forEach(event => {
        eventsHTML += `
            <div class="col-md-4 mb-4">
                <div class="card event-card">
                    <img src="/images/${event.image}" class="card-img-top" alt="${event.title}" onerror="this.src='/images/event-placeholder.jpg'">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${event.description}</p>
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
                    <div class="card-footer">
                        <button class="btn btn-primary register-event-btn" data-event-id="${event.id}">Register for Event</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    eventsContainer.innerHTML = eventsHTML;
    
    // Add event listeners to register buttons
    document.querySelectorAll('.register-event-btn').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event-id');
            registerForEvent(eventId);
        });
    });
}

// Register for an event
function registerForEvent(eventId) {
    // Check if user is logged in first
    fetch('/api/profile')
        .then(response => {
            if (!response.ok) {
                // User is not logged in, redirect to login page
                window.location.href = '/login';
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .then(user => {
            // User is logged in, proceed with registration
            return fetch(`/api/events/${eventId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to register for event');
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Successfully registered for event!');
            // Refresh the events to update UI
            fetchEvents();
        })
        .catch(error => {
            console.error('Error registering for event:', error);
            if (error.message !== 'Not authenticated') {
                alert(error.message || 'Failed to register for event. Please try again.');
            }
        });
}
