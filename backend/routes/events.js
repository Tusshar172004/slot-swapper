// backend/routes/events.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.use(auth);

// create, read, update, delete for authenticated user's events
router.post('/', eventController.createEvent);
router.get('/me', eventController.getMyEvents);
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// get swappable slots from other users
router.get('/swappable', eventController.getSwappableSlots);

module.exports = router;
