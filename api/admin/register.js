import { getDb, getModels } from './_db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  await getDb();
  const { User } = getModels();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash, isAdmin: true });
  res.status(201).json({ message: 'Admin registered' });
} 