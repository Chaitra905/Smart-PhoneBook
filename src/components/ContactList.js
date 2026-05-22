import React from 'react';
import ContactCard from './ContactCard';

function ContactList({ contacts, fetchContacts, search }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contacts.map((contact, index) => (
        <div
          key={contact.id}
          style={{
            animationDelay: `${index * 0.1}s`
          }}
        >
          <ContactCard
            contact={contact}
            fetchContacts={fetchContacts}
            search={search}
          />
        </div>
      ))}
    </div>
  );
}

export default ContactList;
