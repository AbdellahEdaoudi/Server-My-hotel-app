const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const VerifyToken = require('../middleware/verifyToken');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/refresh', userController.refreshToken);
router.post('/logout', VerifyToken, userController.logout);

module.exports = router;
