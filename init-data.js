const express = require('express');
const path = require('path');
const fs = require('fs');

// Create data directory and initialize JSON files
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

console.log('Data initialization complete!');
