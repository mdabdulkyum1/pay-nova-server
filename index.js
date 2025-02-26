const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const transactions = require('./routes/transactions');
const adminRoute = require('./routes/adminRoute')

dotenv.config();

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors());

// Handle WebSocket Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('message', (data) => {
    console.log('Received:', data);

    // Broadcast to all clients
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});




// Routes
app.use("/api", userRoutes);
app.use("/api", adminRoute);
app.use("/api", transactions);







app.get('/', (req, res) => {
  res.send('Pay Nova Server is running');
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  })
