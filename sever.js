const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static('public'));

// WhatsApp Client Setup
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// QR Code Generation
client.on('qr', (qr) => {
  console.log('QR RECEIVED');
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('QR Error:', err);
      return;
    }
    io.emit('qr', url); // Send QR to frontend
    io.emit('message', 'Scan the QR code to link WhatsApp');
  });
});

// Connection Events
client.on('ready', () => {
  console.log('Client is ready!');
  io.emit('message', 'WhatsApp account linked successfully!');
});

client.on('disconnected', () => {
  console.log('Client disconnected');
  io.emit('message', 'Session ended. Please reload to reconnect.');
});

// Initialize
client.initialize();

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});