const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.get('/', userController.getUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/refresh', userController.refreshToken);
router.post('/logout', userController.logoutUser);

module.exports = router;
