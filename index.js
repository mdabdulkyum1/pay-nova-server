const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Connect to MongoDB
connectDB();
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  })