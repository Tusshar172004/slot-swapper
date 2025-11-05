const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const swapController = require('../controllers/swapController');

router.use(auth);

router.post('/request', swapController.createSwapRequest);

router.post('/response/:requestId', swapController.respondToSwap);

router.get('/incoming', swapController.getIncoming);
router.get('/outgoing', swapController.getOutgoing);

module.exports = router;
