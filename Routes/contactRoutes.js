const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/contactController');
const VerifyToken = require('../middleware/verifyToken');

// Public to post contact?
router.post('/', contactController.createContact);

// User routes (authenticated users can manage their own contacts)
router.get('/user', VerifyToken, contactController.getUserContacts);
router.delete('/user/all', VerifyToken, contactController.deleteAllUserContacts);
router.delete('/user/:id', VerifyToken, contactController.deleteUserContact);

module.exports = router;

module.exports = router;
