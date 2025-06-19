import { getDb, getModels } from './_db';
import jwt from 'jsonwebtoken';

function auth(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.isAdmin) throw new Error('Not admin');
  return decoded;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  await getDb();
  const { DropOffIntent } = getModels();
  try {
    auth(req);
    const { eventId } = req.query;
    if (!eventId) return res.status(400).json({ message: 'eventId required' });
    const intents = await DropOffIntent.find({ eventId });
    res.json(intents);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
} 