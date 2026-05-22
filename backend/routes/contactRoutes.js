const express = require('express');

const {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
  getStats
} = require('../controllers/contactController');

const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.use(auth);

router.post('/', createContact);
router.get('/', getContacts);
router.get('/stats', getStats);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;