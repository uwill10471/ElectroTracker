const mongoose = require('mongoose');

const DropOffIntentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flatNumber: { type: String, required: true },
  items: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'CollectionEvent', required: true },
  electronics: [{ type: String }],
  rewards: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DropOffIntent', DropOffIntentSchema); 