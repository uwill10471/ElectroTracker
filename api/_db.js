import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function getDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Models
const CollectionEventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const DropOffIntentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flatNumber: { type: String, required: true },
  items: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'CollectionEvent', required: true },
  electronics: [{ type: String }],
  rewards: { type: Number, default: 0 },
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export function getModels() {
  const CollectionEvent = mongoose.models.CollectionEvent || mongoose.model('CollectionEvent', CollectionEventSchema);
  const DropOffIntent = mongoose.models.DropOffIntent || mongoose.model('DropOffIntent', DropOffIntentSchema);
  const User = mongoose.models.User || mongoose.model('User', UserSchema);
  return { CollectionEvent, DropOffIntent, User };
} 