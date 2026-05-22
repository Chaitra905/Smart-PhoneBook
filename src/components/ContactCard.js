import React, { useState } from 'react';
import { FiStar, FiTrash2, FiEye } from 'react-icons/fi';
import API from '../api';
import ContactModal from './ContactModal';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { highlightText } from '../utils/searchUtils';

function ContactCard({ contact, fetchContacts, search }) {
  const highlight = (text) => ({ __html: highlightText(text, search) || '' });
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { isDark } = useTheme();

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await API.put(`/contacts/${contact.id}`, {
        ...contact,
        is_favorite: !contact.is_favorite
      });
      fetchContacts();
    } catch (error) {
      console.error('Error toggling favorite');
    }
  };

  const deleteContact = async () => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      try {
        setDeleting(true);
        await API.delete(`/contacts/${contact.id}`);
        fetchContacts();
      } catch (error) {
        alert('Error deleting contact');
      } finally {
        setDeleting(false);
      }
    }
  };

  const isFav = contact.is_favorite;

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className={`rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-purple-300 group animate-slide-up ${
          isDark
            ? 'bg-gray-800 text-white'
            : 'bg-white text-gray-900 border-gray-100 shadow-xl'
        }`}
      >
        {/* Header with Favorite Button */}
        <div className={`border-b pb-4 mb-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className={`text-2xl font-black group-hover:text-purple-600 transition-colors ${
                isDark ? 'text-white' : 'text-gray-800'
              }`} dangerouslySetInnerHTML={highlight(contact.name)} />
              {contact.company && (
                <p className="text-purple-500 font-semibold mt-1" dangerouslySetInnerHTML={highlight(contact.company)} />
              )}
            </div>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                isFav
                  ? 'bg-yellow-400 text-yellow-900'
                  : isDark
                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiStar size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-3 mb-5">
          {contact.phone && (
            <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}>
              <span className="text-xs font-bold text-gray-400">PHONE</span>
              <div className="flex-1">
                <p className="font-semibold" dangerouslySetInnerHTML={highlight(contact.phone)} />
              </div>
            </div>
          )}
          
          {contact.email && (
            <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}>
              <span className="text-xs font-bold text-gray-400">EMAIL</span>
              <div className="flex-1">
                <p className="font-semibold truncate" dangerouslySetInnerHTML={highlight(contact.email)} />
              </div>
            </div>
          )}

          {contact.tags && (
            <div className={`mt-4 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                isDark
                  ? 'bg-purple-900/50 text-purple-300'
                  : 'bg-purple-50 text-purple-700'
              }`}>
                {contact.tags}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <FiEye size={16} />
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteContact();
            }}
            disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <FiTrash2 size={16} />
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>

      {showModal && (
        <ContactModal 
          contact={contact} 
          onClose={() => setShowModal(false)}
          fetchContacts={fetchContacts}
        />
      )}
    </>
  );
}

export default ContactCard;
