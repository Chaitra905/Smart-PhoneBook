import React, { useState } from 'react';
import API from '../api';

function ContactModal({ contact, onClose, fetchContacts }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(contact);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put(`/contacts/${contact.id}`, formData);
      fetchContacts();
      onClose();
    } catch (error) {
      alert('Error updating contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            👤 {contact.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white text-3xl hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {editing ? (
            // Edit Mode
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">📱 Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">📧 Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">🏢 Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">📍 Address</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">🏷️ Tags</label>
                <input
                  type="text"
                  value={formData.tags || ''}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              {/* Edit Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-200">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">📱 Phone</p>
                    <p className="text-2xl font-bold text-gray-800">{contact.phone}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">📧 Email</p>
                    <p className="text-2xl font-bold text-gray-800">{contact.email}</p>
                  </div>

                  {contact.company && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">🏢 Company</p>
                      <p className="text-2xl font-bold text-gray-800">{contact.company}</p>
                    </div>
                  )}

                  {contact.address && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">📍 Address</p>
                      <p className="text-2xl font-bold text-gray-800">{contact.address}</p>
                    </div>
                  )}

                  {contact.tags && (
                    <div>
                      <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-2">🏷️ Tags</p>
                      <span className="inline-block bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 px-4 py-2 rounded-full font-bold text-lg">
                        {contact.tags}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t-2 border-purple-300">
                  <p className="text-gray-600 text-sm">
                    📅 Added on: <span className="font-bold">{new Date(contact.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                </div>
              </div>

              {/* View Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  ✏️ Edit Contact
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
