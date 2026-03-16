import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaSchool, FaGlobeAmericas } from 'react-icons/fa';

const Leaderboard = () => {
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [activeTab, setActiveTab] = useState('students');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboards = async () => {
            try {
                const [studentRes, schoolRes] = await Promise.all([
                    api.get('/leaderboard/students'),
                    api.get('/leaderboard/schools')
                ]);
                setStudents(studentRes.data);
                setSchools(schoolRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboards();
    }, []);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <FaMedal className="text-4xl text-yellow-400 drop-shadow-md" />;
            case 2: return <FaMedal className="text-4xl text-gray-400 drop-shadow-md" />;
            case 3: return <FaMedal className="text-4xl text-amber-600 drop-shadow-md" />;
            default: return <span className="text-2xl font-bold text-gray-500 w-10 text-center">{rank}</span>;
        }
    };

    if (loading) return <div className="p-10 text-center text-green-600 font-bold">Loading Leaderboards...</div>;

    const renderList = (data, isSchool = false) => {
        if (data.length === 0) return <div className="text-center py-10 text-gray-500">No data available yet.</div>;

        return (
            <div className="space-y-4">
                {data.map((item, idx) => {
                    const rank = idx + 1;
                    const isTop3 = rank <= 3;

                    return (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={item._id}
                            className={`flex items-center p-4 rounded-2xl border transition hover:shadow-md ${rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-white border-yellow-200' :
                                    rank === 2 ? 'bg-gradient-to-r from-gray-50 to-white border-gray-200' :
                                        rank === 3 ? 'bg-gradient-to-r from-orange-50 to-white border-orange-200' :
                                            'bg-white border-gray-100 hover:border-green-200'
                                }`}
                        >
                            <div className="flex items-center justify-center w-16">
                                {getRankIcon(rank)}
                            </div>

                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 border border-green-200 ml-4 flex-shrink-0">
                                {isSchool ? <FaSchool className="text-2xl" /> : <FaTrophy className="text-2xl" />}
                            </div>

                            <div className="ml-6 flex-1">
                                <h3 className={`text-xl font-bold ${isTop3 ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {isSchool ? item.schoolName : item.name}
                                </h3>
                                {!isSchool && <p className="text-sm font-medium text-green-600">Level: {item.level}</p>}
                                {item.school && <p className="text-sm text-gray-500">{item.school}</p>}
                            </div>

                            <div className="text-right px-6">
                                <p className="text-3xl font-extrabold text-green-700 tracking-tight">
                                    {isSchool ? item.totalPoints : item.ecoPoints}
                                </p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Points</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-12 text-center">
                <FaGlobeAmericas className="text-6xl text-blue-500 mx-auto mb-4 drop-shadow-md" />
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Global Leaderboard</h1>
                <p className="text-xl text-gray-600">See who is leading the charge for a greener tomorrow.</p>
            </header>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 mb-10 overflow-hidden flex">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`flex-1 py-4 text-xl font-bold rounded-2xl transition ${activeTab === 'students' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Top Students
                </button>
                <button
                    onClick={() => setActiveTab('schools')}
                    className={`flex-1 py-4 text-xl font-bold rounded-2xl transition ${activeTab === 'schools' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Top Schools
                </button>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-inner">
                {activeTab === 'students' ? renderList(students) : renderList(schools, true)}
            </div>
        </div>
    );
};

export default Leaderboard;
