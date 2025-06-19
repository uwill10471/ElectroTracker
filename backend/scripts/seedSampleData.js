require('dotenv').config();
const mongoose = require('mongoose');
const CollectionEvent = require('../models/CollectionEvent');
const DropOffIntent = require('../models/DropOffIntent');

const mongoUri = process.env.MONGODB_URI;

async function seed() {
  await mongoose.connect(mongoUri);
  await CollectionEvent.deleteMany({});
  await DropOffIntent.deleteMany({});

  const event = await CollectionEvent.create({
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: 'Community Hall, Block A',
    description: 'Bring your old electronics for safe recycling!'
  });

  await DropOffIntent.create([
    { name: 'Amit Sharma', flatNumber: 'A-101', items: 'Old TV, Mixer', eventId: event._id },
    { name: 'Priya Singh', flatNumber: 'B-202', items: 'Broken Laptop', eventId: event._id },
    { name: 'Rohit Verma', flatNumber: 'C-303', items: 'Mobile Phone, Charger', eventId: event._id }
  ]);

  console.log('Sample data seeded!');
  process.exit(0);
}

seed(); 