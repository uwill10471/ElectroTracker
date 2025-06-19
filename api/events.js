import { getDb, getModels } from './_db';

export default async function handler(req, res) {
  await getDb();
  const { CollectionEvent } = getModels();
  if (req.method === 'GET') {
    const events = await CollectionEvent.find({ date: { $gte: new Date() } }).sort('date');
    return res.status(200).json(events);
  }
  res.status(405).json({ message: 'Method not allowed' });
} 