import React, { useRef } from 'react';
import { FiDownload, FiUpload, FiFileText } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ImportExport = ({ contacts, fetchContacts, API }) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef();

  const exportToCSV = () => {
    if (contacts.length === 0) return;
    
    const headers = ['Name', 'Phone', 'Email', 'Company', 'Address', 'Tags'];
    const csvRows = [
      headers.join(','),
      ...contacts.map(c => [
        `"${c.name}"`,
        `"${c.phone}"`,
        `"${c.email || ''}"`,
        `"${c.company || ''}"`,
        `"${c.address || ''}"`,
        `"${c.tags || ''}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').slice(1); // Skip header
      
      for (let line of lines) {
        if (!line.trim()) continue;
        const [name, phone, email, company, address, tags] = line.split(',').map(s => s.replace(/"/g, '').trim());
        
        try {
          await API.post('/contacts', { name, phone, email, company, address, tags });
        } catch (err) {
          console.error('Failed to import line:', line);
        }
      }
      fetchContacts();
      alert('Import completed!');
    };
    reader.readAsText(file);
  };

  return (
    <div className={`p-4 rounded-2xl border flex flex-wrap gap-4 items-center justify-between ${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-2">
        <FiFileText className="text-purple-500" />
        <span className="font-bold">Tools</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-semibold"
        >
          <FiDownload /> Export CSV
        </button>
        
        <input
          type="file"
          accept=".csv"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImport}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-sm font-semibold ${
            isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          <FiUpload /> Import CSV
        </button>
      </div>
    </div>
  );
};

export default ImportExport;
