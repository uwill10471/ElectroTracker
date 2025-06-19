import { getDb, getModels } from './_db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  await getDb();
  const { DropOffIntent } = getModels();
  const { name, flatNumber, items, eventId, electronics, rewards } = req.body;
  try {
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
} 