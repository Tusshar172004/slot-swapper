const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.use(auth);

router.post('/', eventController.createEvent);
router.get('/me', eventController.getMyEvents);
router.patch('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

router.get('/swappable', eventController.getSwappableSlots);

module.exports = router;
