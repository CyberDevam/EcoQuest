import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FaUsers, FaBook, FaTasks, FaClipboardCheck } from 'react-icons/fa';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/admin/analytics');
                setAnalytics(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Platform Analytics...</div>;

    const userChartData = [
        { name: 'Students', value: analytics?.users?.students || 0, fill: '#3b82f6' },
        { name: 'Teachers', value: analytics?.users?.teachers || 0, fill: '#10b981' }
    ];

    const statsCards = [
        { title: 'Total Users', value: analytics?.users?.total || 0, icon: <FaUsers className="text-blue-500" />, bg: 'bg-blue-50' },
        { title: 'Total Lessons', value: analytics?.activity?.lessons || 0, icon: <FaBook className="text-purple-500" />, bg: 'bg-purple-50' },
        { title: 'Total Challenges', value: analytics?.activity?.challenges || 0, icon: <FaTasks className="text-orange-500" />, bg: 'bg-orange-50' },
        { title: 'Approved Proofs', value: analytics?.activity?.submissions?.approved || 0, icon: <FaClipboardCheck className="text-green-500" />, bg: 'bg-green-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
             <header className="mb-10 flex justify-between items-center">
                 <div>
                     <h1 className="text-4xl font-extrabold text-gray-900 border-l-8 border-indigo-600 pl-4">Platform Admin</h1>
                     <p className="text-lg text-gray-500 mt-2 pl-6">Overview of EcoQuest system metrics.</p>
                 </div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                 {statsCards.map((stat, idx) => (
                     <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                         <div>
                             <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">{stat.title}</p>
                             <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                         </div>
                         <div className={`p-4 rounded-full ${stat.bg} text-2xl`}>
                             {stat.icon}
                         </div>
                     </div>
                 ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* User Demographics Chart */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">User Demographics</h3>
                      <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                               <BarChart data={userChartData}>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                   <YAxis axisLine={false} tickLine={false} />
                                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                   <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60} />
                               </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Quick System Actions (Placeholders) */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">System Management</h3>
                      <div className="space-y-4">
                           <button className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-semibold text-gray-700 transition flex justify-between items-center group">
                               Manage User Accounts
                               <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition transform translate-x-0 group-hover:translate-x-1">&rarr;</span>
                           </button>
                           <button className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-semibold text-gray-700 transition flex justify-between items-center group">
                               Review Reported Content
                               <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition transform translate-x-0 group-hover:translate-x-1">&rarr;</span>
                           </button>
                           <button className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-semibold text-gray-700 transition flex justify-between items-center group">
                               Platform Settings
                               <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition transform translate-x-0 group-hover:translate-x-1">&rarr;</span>
                           </button>
                           <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-xl text-sm font-medium">
                               <strong>Note:</strong> Detailed user management lists and settings modals are planned for the next platform iteration. For now, rely on database administration directly for user deletion.
                           </div>
                      </div>
                  </div>
             </div>
        </div>
    );
};

export default AdminDashboard;
