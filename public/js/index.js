// index.js - Handles functionality for the home page

document.addEventListener('DOMContentLoaded', function() {
    // Fetch featured events for the home page
    fetchFeaturedEvents();
});

// Fetch featured events from the server
function fetchFeaturedEvents() {
    fetch('/api/events')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            return response.json();
        })
        .then(events => {
            // Display only the first 3 events as featured
            const featuredEvents = events.slice(0, 3);
            displayFeaturedEvents(featuredEvents);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            document.getElementById('featured-events').innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-danger">
                        Failed to load events. Please try again later.
                    </div>
                </div>
            `;
        });
}

// Display featured events on the home page
function displayFeaturedEvents(events) {
    const featuredEventsContainer = document.getElementById('featured-events');
    
    if (events.length === 0) {
        featuredEventsContainer.innerHTML = `
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
                        <a href="/events" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    featuredEventsContainer.innerHTML = eventsHTML;
}
