// backend/routes/swap.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const swapController = require('../controllers/swapController');

router.use(auth);

// create swap request
router.post('/request', swapController.createSwapRequest);

// respond to a swap (accept/reject)
router.post('/response/:requestId', swapController.respondToSwap);

// list incoming/outgoing
router.get('/incoming', swapController.getIncoming);
router.get('/outgoing', swapController.getOutgoing);

module.exports = router;
