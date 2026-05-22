const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  company: { type: String },
  address: { type: String },
  tags: { type: String },
  is_favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ContactSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Index for faster search
ContactSchema.index({ name: 'text', email: 'text', phone: 'text', company: 'text' });

module.exports = mongoose.model('Contact', ContactSchema);
