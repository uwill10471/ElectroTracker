import { getDb, getModels } from './_db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  await getDb();
  const { User } = getModels();
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.isAdmin) return res.status(401).json({ message: 'Unauthorized' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Unauthorized' });
  const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
} 