const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'event-management-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Data directory
const DATA_DIR = path.join(__dirname, 'models', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users.json if it doesn't exist
const usersFilePath = path.join(DATA_DIR, 'users.json');
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
}

// Initialize events.json if it doesn't exist
const eventsFilePath = path.join(DATA_DIR, 'events.json');
if (!fs.existsSync(eventsFilePath)) {
  const sampleEvents = [
    {
      id: 1,
      title: 'Tech Conference 2025',
      date: '2025-06-15',
      time: '09:00',
      location: 'Convention Center',
      description: 'Annual technology conference featuring the latest innovations and industry trends.',
      image: 'tech-conference.jpg',
      attendees: []
    },
    {
      id: 2,
      title: 'Music Festival',
      date: '2025-07-20',
      time: '16:00',
      location: 'City Park',
      description: 'A day of live music performances from local and international artists.',
      image: 'music-festival.jpg',
      attendees: []
    },
    {
      id: 3,
      title: 'Charity Run',
      date: '2025-08-05',
      time: '07:30',
      location: 'Riverside Park',
      description: '5K charity run to raise funds for local community projects.',
      image: 'charity-run.jpg',
      attendees: []
    }
  ];
  fs.writeFileSync(eventsFilePath, JSON.stringify(sampleEvents, null, 2));
}

// Routes
// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Events page
app.get('/events', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'events.html'));
});

// Registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Dashboard page (protected route)
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

// API Routes
// Get all events
app.get('/api/events', (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(eventsFilePath));
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Register a new user
app.post('/api/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      name,
      email,
      password, // In a real app, this should be hashed
      registeredEvents: []
    };
    
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    // Set session
    req.session.user = { id: newUser.id, name: newUser.name, email: newUser.email };
    
    res.status(201).json({ message: 'Registration successful', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set session
    req.session.user = { id: user.id, name: user.name, email: user.email };
    
    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout user
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

// Get user profile
app.get('/api/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = users.find(user => user.id === req.session.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password to client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Register for an event
app.post('/api/events/:id/register', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const eventId = parseInt(req.params.id);
    const events = JSON.parse(fs.readFileSync(eventsFilePath));
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    
    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const userIndex = users.findIndex(user => user.id === req.session.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user is already registered for this event
    if (events[eventIndex].attendees.includes(req.session.user.id)) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }
    
    // Add user to event attendees
    events[eventIndex].attendees.push(req.session.user.id);
    
    // Add event to user's registered events
    if (!users[userIndex].registeredEvents.includes(eventId)) {
      users[userIndex].registeredEvents.push(eventId);
    }
    
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// Get user's registered events
app.get('/api/user/events', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const events = JSON.parse(fs.readFileSync(eventsFilePath));
    
    const user = users.find(user => user.id === req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userEvents = events.filter(event => user.registeredEvents.includes(event.id));
    res.json(userEvents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user events' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
