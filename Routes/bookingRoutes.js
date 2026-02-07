const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');
const VerifyToken = require('../middleware/verifyToken');

// Ideally basic users can create bookings, admins can see all.
// Adjust as per business logic. For now, assuming user logged in to book.
// User fetching their own bookings
router.get('/', VerifyToken, bookingController.getAllBookings);
router.get('/:id', VerifyToken, bookingController.getBookingById); // User or Admin details
router.post('/', VerifyToken, bookingController.createBooking); // User creates
router.delete('/all', VerifyToken, bookingController.deleteAllBookings); // User deletes their own
router.delete('/:id', VerifyToken, bookingController.deleteBookingById); // User cancels their booking
router.put('/:id', VerifyToken, bookingController.updateBooking); // User pays (updates status)

module.exports = router;
