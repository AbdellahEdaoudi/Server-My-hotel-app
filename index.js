require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4444;
const path = require("path")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/dbConnect');
const BookingSchema = require('./Models/BookingSchema');
const { corsOption } = require(path.join(__dirname, 'config', 'corsOptions'));

// Connect to Database
connectDB();
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());



// Root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to EdHotel API" });
});

// Routes
app.use('/api/users', require('./Routes/userRoutes'));
app.use('/api/rooms', require('./Routes/roomRoutes'));
app.use('/api/contact', require('./Routes/contactRoutes'));
app.use('/api/booking', require('./Routes/bookingRoutes'));
app.use('/api/admin', require('./Routes/adminRoutes'));

app.get('/test', async (req, res) => {
  const test = await BookingSchema.find();
  res.json(test);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start the server only if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;