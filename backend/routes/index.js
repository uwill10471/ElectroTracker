var express = require('express');
var router = express.Router();
const CollectionEvent = require('../models/CollectionEvent');
const DropOffIntent = require('../models/DropOffIntent');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get next collection event
router.get('/next-event', async (req, res) => {
  try {
    const event = await CollectionEvent.findOne({ date: { $gte: new Date() } }).sort('date');
    if (!event) return res.status(404).json({ message: 'No upcoming event found.' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register drop-off intent
router.post('/dropoff', async (req, res) => {
  try {
    const { name, flatNumber, items, eventId, electronics, rewards } = req.body;
    const intent = new DropOffIntent({
      name,
      flatNumber,
      items,
      eventId,
      electronics: electronics || [],
      rewards: typeof rewards === 'number' ? rewards : 10
    });
    await intent.save();
    res.status(201).json({ message: 'Drop-off intent registered.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all upcoming collection events
router.get('/events', async (req, res) => {
  try {
    const events = await CollectionEvent.find({ date: { $gte: new Date() } }).sort('date');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
