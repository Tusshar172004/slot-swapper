const Event = require('../models/Event');


exports.createEvent = async (req, res) => {
try {
const { title, startTime, endTime } = req.body;
const evt = await Event.create({ title, startTime, endTime, owner: req.user._id });
res.json(evt);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getMyEvents = async (req, res) => {
const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
res.json(events);
};


exports.updateEvent = async (req, res) => {
try {
const { id } = req.params;
const update = req.body;
const evt = await Event.findOneAndUpdate({ _id: id, owner: req.user._id }, update, { new: true });
if (!evt) return res.status(404).json({ message: 'Event not found' });
res.json(evt);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.deleteEvent = async (req, res) => {
try {
const { id } = req.params;
const evt = await Event.findOneAndDelete({ _id: id, owner: req.user._id });
if (!evt) return res.status(404).json({ message: 'Event not found' });
res.json({ message: 'Deleted' });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getSwappableSlots = async (req, res) => {
  try {
    // Make sure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    // Fetch all SWAPPABLE events from other users
    const slots = await Event.find({
      status: 'SWAPPABLE',
      owner: { $ne: req.user._id }, // exclude current user's own slots
    })
      .populate('owner', 'name email')
      .sort({ startTime: 1 });

    // Log result count to verify backend works
    console.log(`Swappable slots found: ${slots.length}`);

    res.json(slots);
  } catch (err) {
    console.error('Error fetching swappable slots:', err);
    res.status(500).json({ message: 'Server error while fetching swappable slots' });
  }
};
