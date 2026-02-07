const express = require('express');
const router = express.Router();
const roomsController = require('../Controllers/roomsController');
// Public routes
router.get('/', roomsController.getRooms);
router.get('/:id', roomsController.getRoomById);

module.exports = router;
