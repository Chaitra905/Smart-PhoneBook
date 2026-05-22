import React, { useEffect, useState } from 'react';
import API from './api';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import AdvancedSearchBar from './components/AdvancedSearchBar';
import FilterBar from './components/FilterBar';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import ImportExport from './components/ImportExport';
import Auth from './components/Auth';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

import { advancedSearch } from './utils/searchUtils';
import { FiLogOut, FiUser } from 'react-icons/fi';

function MainApp() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [companyFilter, setCompanyFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/contacts');
      setContacts(res.data);
    } catch (error) {
      console.error('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = React.useMemo(() => {
    let result = search.trim() ? advancedSearch(contacts, search) : [...contacts];

    if (companyFilter) result = result.filter(c => c.company === companyFilter);
    if (tagFilter) result = result.filter(c => c.tags?.includes(tagFilter));

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

    return result;
  }, [contacts, search, companyFilter, tagFilter, sortBy]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-indigo-600">SmartConnect</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <FiUser className="text-purple-500" />
              <span className="font-medium">{user?.username}</span>
            </div>
            <ThemeToggle />
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
              title="Logout"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <Dashboard />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <AdvancedSearchBar search={search} setSearch={setSearch} contacts={contacts} />
            <FilterBar 
              sortBy={sortBy} 
              setSortBy={setSortBy} 
              companyFilter={companyFilter} 
              setCompanyFilter={setCompanyFilter}
              tagFilter={tagFilter}
              setTagFilter={setTagFilter}
              companyOptions={[...new Set(contacts.map(c => c.company).filter(Boolean))]}
            />
            <ContactList contacts={filteredContacts} fetchContacts={fetchContacts} />
          </div>
          
          <div className="xl:col-span-1 space-y-6">
            <ContactForm fetchContacts={fetchContacts} contacts={contacts} />
            <ImportExport contacts={contacts} fetchContacts={fetchContacts} API={API} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return user ? <MainApp /> : <Auth />;
}
