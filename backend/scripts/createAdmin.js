require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const email = process.env.VITE_GUEST_EMAIL;
const password = process.env.VITE_GUEST_PASSWORD;
const mongoUri = process.env.MONGODB_URI;

if (!email || !password || !mongoUri) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

async function createAdmin() {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash, isAdmin: true });
  console.log('Admin user created successfully.');
  process.exit(0);
}

createAdmin(); 