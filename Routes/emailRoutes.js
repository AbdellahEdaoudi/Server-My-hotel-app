const express = require('express');
const router = express.Router();
const emailController = require('../Controllers/emailController');

router.post('/send', emailController.sendEmail);
router.post('/sendAll', emailController.sendEmailAll);

module.exports = router;
