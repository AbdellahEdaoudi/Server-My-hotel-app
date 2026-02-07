require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4444;

const corsOptions = {
  origin: 'http://localhost:3000', // Allow frontend origin
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true
};

app.use(cors(corsOptions));

// Connect to Mongodb Atlas
mongoose.set('strictQuery', true);
mongoose.connect(process.env.URL_DATABASE)
  .then(() => {
    console.log(`Connected to Mongodb Atlas`);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });

// Root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to EdHotel API" });
});

// Routes
app.use('/api/users', require('./Routes/userRoutes'));
app.use('/api/rooms', require('./Routes/roomRoutes'));
app.use('/api/contact', require('./Routes/contactRoutes'));
app.use('/api/booking', require('./Routes/bookingRoutes'));
app.use('/api/email', require('./Routes/emailRoutes'));
app.use('/api/admin', require('./Routes/adminRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
