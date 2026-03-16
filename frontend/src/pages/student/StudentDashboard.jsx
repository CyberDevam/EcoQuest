import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FaTrophy, FaStar, FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/student/dashboard');
                setDashboardData(res.data);
            } catch (err) {
                console.error('Error fetching dashboard', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading your eco-stats...</div>;

    const chartData = [
        { name: 'Completed Challenges', value: dashboardData?.completedChallengesCount || 0 },
        { name: 'Remaining to Next Level', value: (dashboardData?.totalPoints > 1000 ? 0 : 50) } // Example dummy logic for demo
    ];
    const COLORS = ['#10b981', '#e5e7eb'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                     <h1 className="text-3xl font-extrabold text-gray-900">Hello, {user.name}!</h1>
                     <p className="text-gray-500 mt-1">Ready to make a difference today?</p>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                     <FaStar className="text-yellow-400 text-xl" />
                     <span className="font-bold text-green-800">Level: {dashboardData?.level}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Stats Card */}
                <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold opacity-90">Total Eco Points</h3>
                        <FaLeaf className="text-2xl text-yellow-300 opacity-80" />
                    </div>
                    <p className="text-5xl font-extrabold">{dashboardData?.totalPoints}</p>
                    <p className="mt-4 text-sm font-medium opacity-80">Top {dashboardData?.rank > 0 ? dashboardData?.rank : '?'} in the platform</p>
                </motion.div>

                {/* Quick actions box */}
                <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center gap-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your Next Steps</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/student/lessons" className="flex items-center p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition border border-blue-100 font-semibold group">
                             <span className="flex-1">Explore Lessons</span>
                             <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs ml-2 group-hover:bg-blue-300">New!</span>
                        </Link>
                        <Link to="/student/challenges" className="flex items-center p-4 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition border border-amber-100 font-semibold">
                             <span className="flex-1">Active Challenges</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                     <h3 className="text-xl font-bold text-gray-800 mb-6">Activity Breakdown</h3>
                     <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>

                {/* Badges section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                     <h3 className="text-xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                         Earned Badges
                         <FaTrophy className="text-yellow-400 text-2xl" />
                     </h3>
                     
                     <div className="flex-1 flex items-center justify-center">
                         {dashboardData?.student?.badges?.length > 0 ? (
                             <div className="grid grid-cols-3 gap-4 w-full">
                                  {dashboardData.student.badges.map(b => (
                                      <div key={b._id} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                           <img src={b.icon} alt={b.name} className="w-12 h-12 mx-auto mb-2" />
                                           <p className="text-xs font-bold text-gray-700">{b.name}</p>
                                      </div>
                                  ))}
                             </div>
                         ) : (
                             <div className="text-center text-gray-400">
                                 <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-200 mx-auto flex items-center justify-center mb-3">
                                     <FaTrophy className="text-gray-300 text-2xl" />
                                 </div>
                                 <p className="font-medium">No badges yet.</p>
                                 <p className="text-sm mt-1">Complete challenges to earn them!</p>
                             </div>
                         )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
