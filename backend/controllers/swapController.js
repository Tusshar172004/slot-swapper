// backend/controllers/swapController.js
const mongoose = require('mongoose');
const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');

// Create a new swap request: mySlotId (the requester's slot), theirSlotId (target slot)
exports.createSwapRequest = async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ message: 'Both mySlotId and theirSlotId are required' });
    }

    // Load slots
    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(mySlotId),
      Event.findById(theirSlotId)
    ]);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots not found' });
    }

    // Validate ownership & states
    if (!mySlot.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'mySlot must belong to the authenticated user' });
    }
    if (theirSlot.owner.equals(req.user._id)) {
      return res.status(400).json({ message: 'Cannot request swap for your own slot' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
    }

    // Use a transaction: create SwapRequest, mark both events SWAP_PENDING
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const swap = await SwapRequest.create([{
        fromUser: req.user._id,
        toUser: theirSlot.owner,
        mySlot: mySlot._id,
        theirSlot: theirSlot._id,
        status: 'PENDING'
      }], { session });

      await Event.updateMany(
        { _id: { $in: [mySlot._id, theirSlot._id] } },
        { $set: { status: 'SWAP_PENDING' } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const populated = await SwapRequest.findById(swap[0]._id)
        .populate('fromUser', 'name email')
        .populate('toUser', 'name email')
        .populate('mySlot')
        .populate('theirSlot');

      return res.status(201).json(populated);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error('createSwapRequest error:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Respond to a swap request: accept = true/false
exports.respondToSwap = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    if (typeof accept !== 'boolean') {
      return res.status(400).json({ message: 'accept (boolean) is required in body' });
    }

    const swap = await SwapRequest.findById(requestId).populate('mySlot theirSlot fromUser toUser');
    if (!swap) return res.status(404).json({ message: 'Swap request not found' });

    // Only the recipient (toUser) may respond
    if (!swap.toUser._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    if (swap.status !== 'PENDING') {
      return res.status(400).json({ message: 'Swap request already handled' });
    }

    if (!accept) {
      // Reject: set swap.status = REJECTED and revert events -> SWAPPABLE
      swap.status = 'REJECTED';
      await swap.save();

      await Event.updateMany(
        { _id: { $in: [swap.mySlot._id, swap.theirSlot._id] } },
        { $set: { status: 'SWAPPABLE' } }
      );

      return res.json({ message: 'Swap rejected', swap });
    }

    // Accept: transactionally swap owners and set statuses to BUSY
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const mySlot = await Event.findById(swap.mySlot._id).session(session);
      const theirSlot = await Event.findById(swap.theirSlot._id).session(session);

      if (!mySlot || !theirSlot) throw new Error('Slots not found during accept flow');

      // Ensure they are still pending (not taken in another flow)
      if (mySlot.status !== 'SWAP_PENDING' || theirSlot.status !== 'SWAP_PENDING') {
        throw new Error('One or both slots are not in SWAP_PENDING state');
      }

      // Swap owners
      const tempOwner = mySlot.owner;
      mySlot.owner = theirSlot.owner;
      theirSlot.owner = tempOwner;

      // Set statuses to BUSY
      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';

      await mySlot.save({ session });
      await theirSlot.save({ session });

      swap.status = 'ACCEPTED';
      await swap.save({ session });

      await session.commitTransaction();
      session.endSession();

      const populated = await SwapRequest.findById(swap._id)
        .populate('fromUser', 'name email')
        .populate('toUser', 'name email')
        .populate('mySlot')
        .populate('theirSlot');

      return res.json({ message: 'Swap accepted', swap: populated });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (err) {
    console.error('respondToSwap error:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.getIncoming = async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ toUser: req.user._id })
      .sort({ createdAt: -1 })
      .populate('fromUser', 'name email')
      .populate('mySlot')
      .populate('theirSlot');
    return res.json(incoming);
  } catch (err) {
    console.error('getIncoming error:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

exports.getOutgoing = async (req, res) => {
  try {
    const outgoing = await SwapRequest.find({ fromUser: req.user._id })
      .sort({ createdAt: -1 })
      .populate('toUser', 'name email')
      .populate('mySlot')
      .populate('theirSlot');
    return res.json(outgoing);
  } catch (err) {
    console.error('getOutgoing error:', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
