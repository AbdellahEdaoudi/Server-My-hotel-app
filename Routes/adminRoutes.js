const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const VerifyAdmin = require('../middleware/verifyAdmin');
const upload = require('../middleware/multer');

// Apply VerifyAdmin to all routes in this router
// router.use(VerifyAdmin);

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.delete('/bookings/:id',VerifyAdmin,adminController.deleteBooking);

// Contacts
router.get('/contacts', adminController.getAllContacts);
router.get('/contacts/:id', adminController.getContactById);
router.delete('/contacts/:id',VerifyAdmin, adminController.deleteContact);

// Rooms
router.post('/rooms',VerifyAdmin, upload.single('image'), adminController.createRoom);
router.put('/rooms/:id',VerifyAdmin, upload.single('image'), adminController.updateRoom);
router.delete('/rooms/:id',VerifyAdmin, adminController.deleteRoom);

// Users
router.get('/users', adminController.getAllUsers);
router.post('/users',VerifyAdmin, adminController.createUser);
router.put('/users/:id',VerifyAdmin, adminController.updateUser);
router.delete('/users/:id',VerifyAdmin, adminController.deleteUser);

module.exports = router;
