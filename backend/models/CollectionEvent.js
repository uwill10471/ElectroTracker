const mongoose = require('mongoose');

const CollectionEventSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CollectionEvent', CollectionEventSchema); 