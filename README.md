# Event Management System

A web-based application for managing events, allowing users to browse events, register for an account, and sign up for events they're interested in attending.

## Project Description

This Event Management System is a full-stack web application built using Node.js, Express, and vanilla JavaScript. It allows users to:

- Browse upcoming events
- Register for an account
- Log in and manage their profile
- Register for events
- View their registered events on a personal dashboard

The application uses JSON files for data storage, session management for authentication, and implements all required features from the project specifications.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Bootstrap 5
- **Data Storage**: JSON files
- **Authentication**: Express-session, cookies

## Project Structure

```
event-management-system/
├── models/
│   └── data/
│       ├── events.json
│       └── users.json
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── events.js
│   │   ├── index.js
│   │   ├── login.js
│   │   └── register.js
│   └── images/
│       ├── tech-conference.jpg
│       ├── music-festival.jpg
│       ├── charity-run.jpg
│       └── event-placeholder.jpg
├── views/
│   ├── index.html
│   ├── events.html
│   ├── register.html
│   ├── login.html
│   └── dashboard.html
├── server.js
├── create-images.js
├── init-data.js
├── package.json
└── README.md
```

## Features

1. **User Authentication**
   - Registration with form validation
   - Login/logout functionality
   - Session management with cookies

2. **Event Management**
   - Browse all events
   - View event details
   - Register for events
   - View registered events on dashboard

3. **Server-Side Features**
   - Static file serving (HTML, CSS, JS, images)
   - API endpoints for data retrieval and manipulation
   - Form data processing with POST method
   - JSON data storage

4. **Client-Side Features**
   - Responsive design with Bootstrap
   - Fetch API for HTTP requests
   - Dynamic content loading
   - Form validation

## Setup Instructions

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm (v6 or higher)

2. **Installation**
   ```bash
   # Clone the repository (if applicable)
   git clone <repository-url>
   
   # Navigate to the project directory
   cd event-management-system
   
   # Install dependencies
   npm install
   
   # Initialize data
   node init-data.js
   
   # Generate placeholder images
   node create-images.js
   
   # Start the server
   node server.js
   ```

3. **Access the Application**
   - Open a web browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /api/events` - Get all events
- `GET /api/profile` - Get user profile (requires authentication)
- `GET /api/user/events` - Get user's registered events (requires authentication)
- `POST /api/register` - Register a new user
- `POST /api/login` - Log in a user
- `GET /api/logout` - Log out a user
- `POST /api/events/:id/register` - Register for an event (requires authentication)

## Project Requirements Fulfilled

1. ✅ Used Node.js and JavaScript for server-side and client-side scripting
2. ✅ Implemented HTML and CSS with Bootstrap for UI
3. ✅ Served static data (HTML, images, CSS, JS files) from the server
4. ✅ Used fetch function for HTTP requests to the server
5. ✅ Implemented a registration form with POST method
6. ✅ Saved form data on the server using JSON files
7. ✅ Implemented cookies and session management (bonus)

## Contributors

- Created as a web programming project

## License

This project is created for educational purposes.
