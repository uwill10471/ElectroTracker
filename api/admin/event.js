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
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  await getDb();
  const { CollectionEvent } = getModels();
  try {
    const user = auth(req);
    const { date, location, description } = req.body;
    let event = await CollectionEvent.findOne({ date: { $gte: new Date() } });
    if (event) {
      event.date = date;
      event.location = location;
      event.description = description;
      await event.save();
      return res.json({ message: 'Event updated', event });
    }
    event = new CollectionEvent({ date, location, description, createdBy: user.id });
    await event.save();
    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
} 