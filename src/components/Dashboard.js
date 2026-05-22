import React, { useState, useEffect } from 'react';
import { FiTarget, FiFilter, FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import API from '../api';

const Dashboard = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'];

  const fetchStats = async () => {
    try {
      const res = await API.get('/contacts/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`rounded-2xl p-6 backdrop-blur-md border transition-all hover:scale-[1.02] ${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-white/20 shadow-lg'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
          <Icon size={24} />
        </div>
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="h-40 flex items-center justify-center">Loading Analytics...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FiFilter} label="Total Contacts" value={stats?.total || 0} color="purple" />
        <StatCard icon={FiStar} label="Favorites" value={stats?.favorites || 0} color="yellow" />
        <StatCard icon={FiTarget} label="Companies" value={stats?.companies?.length || 0} color="blue" />
        <StatCard icon={FiTrendingUp} label="Top Tag" value={stats?.tags?.[0]?.name || 'None'} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tags Distribution */}
        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-white/20 shadow-xl'}`}>
          <h3 className="text-xl font-bold mb-6">Tag Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.tags} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats?.tags?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company Overview */}
        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-white/20 shadow-xl'}`}>
          <h3 className="text-xl font-bold mb-6">Company Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.companies}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: '12px' }}/>
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
