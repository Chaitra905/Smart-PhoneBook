const Contact = require('../models/Contact');
const ActivityLog = require('../models/ActivityLog');

// Helper to log activities
const logActivity = async (userId, action, details) => {
  try {
    const log = new ActivityLog({ user: userId, action, details });
    await log.save();
  } catch (err) {
    console.error('Logging failed:', err);
  }
};

// CREATE CONTACT
exports.createContact = async (req, res) => {
  const { name, phone, email, company, address, tags } = req.body;
  try {
    const newContact = new Contact({
      user: req.user.id,
      name,
      phone,
      email,
      company,
      address,
      tags
    });
    const contact = await newContact.save();
    await logActivity(req.user.id, 'ADD_CONTACT', `Added contact: ${name}`);
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CONTACTS
exports.getContacts = async (req, res) => {
  const search = req.query.search || '';
  try {
    let query = { user: req.user.id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
      await logActivity(req.user.id, 'SEARCH', `Searched for: ${search}`);
    }
    const contacts = await Contact.find(query).sort({ is_favorite: -1, name: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CONTACT
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    await logActivity(req.user.id, 'UPDATE_CONTACT', `Updated contact: ${contact.name}`);
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE CONTACT
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    await logActivity(req.user.id, 'DELETE_CONTACT', `Deleted contact: ${contact.name}`);
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DASHBOARD STATS
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const total = await Contact.countDocuments({ user: userId });
    const favorites = await Contact.countDocuments({ user: userId, is_favorite: true });
    
    // Aggregate companies
    const companies = await Contact.aggregate([
      { $match: { user: new require('mongoose').Types.ObjectId(userId), company: { $ne: null, $ne: '' } } },
      { $group: { _id: '$company', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    // Aggregate tags
    const contactsWithTags = await Contact.find({ user: userId, tags: { $ne: null, $ne: '' } }, 'tags');
    const tagMap = {};
    contactsWithTags.forEach(c => {
      c.tags.split(',').forEach(tag => {
        const t = tag.trim();
        if (t) tagMap[t] = (tagMap[t] || 0) + 1;
      });
    });
    const tags = Object.entries(tagMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

    res.json({ total, favorites, companies, tags });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};