const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create placeholder images for the sample events
const createPlaceholderImage = (filename, color, text) => {
  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(imagesDir, filename), buffer);
  console.log(`Created ${filename}`);
};

// Create the event images
createPlaceholderImage('tech-conference.jpg', '#3498db', 'Tech Conference 2025');
createPlaceholderImage('music-festival.jpg', '#e74c3c', 'Music Festival');
createPlaceholderImage('charity-run.jpg', '#2ecc71', 'Charity Run');
createPlaceholderImage('event-placeholder.jpg', '#34495e', 'Event Placeholder');

console.log('All images created successfully!');
