import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FaBookOpen, FaPlayCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StudentLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await api.get('/student/lessons');
                setLessons(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading your curriculum...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Eco-Lessons</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Expand your knowledge about the environment and prepare for real-world challenges.</p>
            </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lessons.map((lesson, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={lesson._id} 
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100 flex flex-col"
                    >
                        {/* Placeholder generic image if none provided */}
                         <div className="bg-green-100 h-48 w-full flex items-center justify-center border-b border-green-50 relative overflow-hidden">
                             {lesson.media ? (
                                  <img src={lesson.media} alt={lesson.title} className="w-full h-full object-cover" />
                             ) : (
                                  <FaBookOpen className="text-6xl text-green-300 opacity-50" />
                             )}
                             <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                 +{lesson.pointsReward} Pts
                             </div>
                         </div>
                         
                         <div className="p-6 flex-1 flex flex-col">
                             <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{lesson.title}</h2>
                             <p className="text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                                 {lesson.description}
                             </p>
                             
                             <Link 
                                to={`/student/lesson/${lesson._id}`} 
                                className="mt-auto w-full flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 px-4 rounded-xl transition border border-green-200"
                             >
                                 <FaPlayCircle className="text-lg" /> Start Learning
                             </Link>
                         </div>
                    </motion.div>
                ))}
            </div>
            
            {lessons.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                     <FaBookOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-gray-600 mb-2">No lessons available yet</h3>
                     <p className="text-gray-500">Check back later when teachers have uploaded new content.</p>
                </div>
            )}
        </div>
    );
};

export default StudentLessons;
