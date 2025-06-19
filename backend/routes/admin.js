const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const CollectionEvent = require('../models/CollectionEvent');
const DropOffIntent = require('../models/DropOffIntent');

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.isAdmin) return res.status(401).json({ message: 'Unauthorized' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Unauthorized' });
  const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Middleware to check admin JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) throw new Error();
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Create or update collection event
router.post('/event', auth, async (req, res) => {
  const { date, location, description } = req.body;
  let event = await CollectionEvent.findOne({ date: { $gte: new Date() } });
  if (event) {
    event.date = date;
    event.location = location;
    event.description = description;
    await event.save();
    return res.json({ message: 'Event updated', event });
  }
  event = new CollectionEvent({ date, location, description, createdBy: req.user.id });
  await event.save();
  res.status(201).json({ message: 'Event created', event });
});

// View all drop-off intents for next event
router.get('/dropoffs', auth, async (req, res) => {
  const event = await CollectionEvent.findOne({ date: { $gte: new Date() } }).sort('date');
  if (!event) return res.status(404).json({ message: 'No upcoming event' });
  const intents = await DropOffIntent.find({ eventId: event._id });
  res.json(intents);
});

// Admin registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash, isAdmin: true });
  res.status(201).json({ message: 'Admin registered' });
});

module.exports = router; 