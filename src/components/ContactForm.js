import React, { useState } from 'react';
import API from '../api';

function ContactForm({ fetchContacts, contacts = [] }) {
  const [form, setForm] = useState({
    name: '',
    countryCode: '+91', // Default to India
    phone: '',
    email: '',
    company: '',
    address: '',
    tags: ''
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setWarning('');

    const fullPhone = `${form.countryCode} ${form.phone}`;

    // Client-side Duplicate Detection
    const duplicate = contacts.find(c => c.phone === fullPhone || (form.email && c.email === form.email));
    if (duplicate && !warning) {
      setWarning(`A contact with this ${duplicate.phone === fullPhone ? 'phone' : 'email'} already exists (${duplicate.name}). Proceed anyway?`);
      return;
    }

    if (!form.name || !form.phone) {
      setError('Please fill in all required fields');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setSubmitting(true);
      await API.post('/contacts', { ...form, phone: fullPhone });
      setSuccess('Contact added successfully!');

      setForm({
        name: '',
        countryCode: '+91',
        phone: '',
        email: '',
        company: '',
        address: '',
        tags: ''
      });

      setTimeout(() => setSuccess(''), 4000);
      fetchContacts();
    } catch (err) {
      const message = err.response?.data?.message || 'Error adding contact';
      setError(message);
      setTimeout(() => setError(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl mb-8 border-2 border-white/50"
    >
      <h3 className="text-2xl font-black text-gray-800 mb-6">
        New Contact
      </h3>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-2xl border-l-4 border-green-500 font-bold">
          {success}
        </div>
      )}

      {warning && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-2xl border-l-4 border-yellow-500 font-bold flex justify-between items-center text-sm">
          <span>{warning}</span>
          <button 
            type="button" 
            onClick={() => setWarning('')}
            className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl border-l-4 border-red-500 font-bold">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-gray-700 font-bold text-xs uppercase tracking-wider">Name *</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-gray-700 font-bold text-xs uppercase tracking-wider">Phone Number *</label>
          <div className="flex gap-2">
            <select
              value={form.countryCode}
              onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
              className="p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none bg-white font-medium"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
            </select>
            <input
              type="tel"
              placeholder="98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="flex-1 p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-gray-700 font-bold text-xs uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-gray-700 font-bold text-xs uppercase tracking-wider">Company</label>
            <input
              type="text"
              placeholder="Google"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-gray-700 font-bold text-xs uppercase tracking-wider">Tags</label>
            <input
              type="text"
              placeholder="Client, VIP"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Save Contact'}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
