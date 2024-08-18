require('dotenv').config();
const VerifyToken = require('./middleware/verifyToken');
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4444;
const userController = require("./Controllers/userController")
const adminController = require("./Controllers/adminController")
const roomsController = require('./Controllers/roomsController');
const contactController = require('./Controllers/contactController');
const bookingController = require('./Controllers/bookingController');
const checkoutController = require('./Controllers/checkoutController');
const emailController = require('./Controllers/emailController'); 
const upload = require("./middleware/multer");

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Connect to Mongodb Atlas
mongoose.set('strictQuery', true);
mongoose.connect(process.env.URL_DATABASE)
  .then(() => {
    console.log(`Connect to Mongodb Atlas`);
  })
  .catch(err => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`Server runing in port ${PORT}`);
});

// User Routes
app.get('/users', userController.getUsers);
app.post('/register', userController.registerUser);
app.post('/login', userController.loginUser);
app.get('/refresh', userController.refreshToken);
app.post('/logout', userController.logoutUser);

// Admin Routes
app.post('/register', adminController.registerAdmin);
app.post('/login', adminController.loginAdmin);

// Rooms Routes
app.get('/Rooms', roomsController.getRooms);
app.post('/Rooms', upload.single('image'), roomsController.createRoom);
app.post('/Roomss', roomsController.bulkInsertRooms);
app.get('/Rooms/:id', roomsController.getRoomById);
app.put('/Rooms/:id', upload.single('image'), roomsController.updateRoom);
app.delete('/Rooms/:id', roomsController.deleteRoom);
app.delete('/Roomsd', roomsController.deleteAllRooms);

// Contact Routes
app.get('/Contact', contactController.getContacts);
app.get('/Contact/:id', contactController.getContactById);
app.post('/Contact', contactController.createContact);
app.delete('/Contact', contactController.deleteAllContacts);
app.post('/ContactDoc', contactController.bulkInsertContacts);
app.delete('/Contact/:id', contactController.deleteContactById);

// Booking Routes
app.get('/Booking', bookingController.getAllBookings);
app.get('/Booking/:id', bookingController.getBookingById);
app.post('/Booking', bookingController.createBooking);
app.put('/Booking/:id', bookingController.updateBookingById);
app.delete('/Booking/:id', bookingController.deleteBookingById);
app.delete('/Bookingd', bookingController.deleteAllBookings);
app.delete('/BookingdAll', bookingController.deleteSelectedBookings);
app.get('/Bookingpay', bookingController.getBookingsByIds);

// Payment Routes
app.get('/Checkout', checkoutController.getAllCheckouts);
app.get('/Checkout/:id', checkoutController.getCheckoutById);
app.post('/Checkout', checkoutController.createCheckout);
app.put('/Checkout/:id', checkoutController.updateCheckoutById);
app.delete('/Checkout/:id', checkoutController.deleteCheckoutById);
app.delete('/Checkoutd', checkoutController.deleteAllCheckouts);
app.delete('/CheckoutAll', checkoutController.deleteSelectedCheckouts);
app.get('/Checkoutpay', checkoutController.getCheckoutsByIds);
app.post('/CheckoutDoc', checkoutController.addMultipleCheckouts);

// SEND EMAIL
app.post('/SendEmail', emailController.sendEmail);
app.post('/SendEmailAll', emailController.sendEmailAll);
