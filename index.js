const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;
const storageFile = './messages.json';

// Enable CORS
app.use(cors());

// Create storage file if it doesn't exist
if (!fs.existsSync(storageFile)) {
  fs.writeFileSync(storageFile, '[]');
}

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to create a new message
app.post('/messages', (req, res) => {
  const messages = loadMessages();
  const id = generateId();
  const text = req.body.text;
  const message = { id, text };
  messages.push(message);
  saveMessages(messages);
  res.json(message);
});

// Endpoint to update an existing message
app.put('/messages/:id', (req, res) => {
  const messages = loadMessages();
  const id = req.params.id;
  const text = req.body.text;
  const index = messages.findIndex(message => message.id === id);
  if (index === -1) {
    res.sendStatus(404);
  } else {
    messages[index].text = text;
    saveMessages(messages);
    res.sendStatus(204);
  }
});

// Endpoint to delete an existing message
app.delete('/messages/:id', (req, res) => {
  const messages = loadMessages();
  const id = req.params.id;
  const index = messages.findIndex(message => message.id === id);
  if (index === -1) {
    res.sendStatus(404);
  } else {
    messages.splice(index, 1);
    saveMessages(messages);
    res.sendStatus(204);
  }
});

// Endpoint to view all messages
app.get('/messages', (req, res) => {
  const messages = loadMessages();
  res.json(messages);
});

// Load messages from storage file
function loadMessages() {
  const messagesJson = fs.readFileSync(storageFile);
  return JSON.parse(messagesJson);
}

// Save messages to storage file
function saveMessages(messages) {
  const messagesJson = JSON.stringify(messages);
  fs.writeFileSync(storageFile, messagesJson);
}

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening at https://message-server.yhemen5525.repl.co`);
});
