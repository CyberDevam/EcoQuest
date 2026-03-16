import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBook, FaTasks, FaClipboardCheck, FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TeacherDashboard = () => {
    const { user } = useContext(AuthContext);

    const actionCards = [
        {
            title: 'Create Lesson',
            description: 'Design interactive educational content and quizzes.',
            icon: <FaBook />,
            link: '/teacher/create-lesson',
            color: 'bg-blue-500',
            hover: 'hover:bg-blue-600'
        },
        {
            title: 'Create Challenge',
            description: 'Publish real-world eco-tasks for students to complete.',
            icon: <FaTasks />,
            link: '/teacher/create-challenge',
            color: 'bg-orange-500',
            hover: 'hover:bg-orange-600'
        },
        {
            title: 'Review Submissions',
            description: 'Grade student challenge proofs and award points.',
            icon: <FaClipboardCheck />,
            link: '/teacher/submissions',
            color: 'bg-green-600',
            hover: 'hover:bg-green-700'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-emerald-700 to-green-900 text-white shadow-xl">
                 <h1 className="text-4xl font-extrabold mb-2">Welcome, {user.name}</h1>
                 <p className="text-xl text-green-100 font-medium">Manage your classroom's EcoQuest journey.</p>
            </header>

            <div className="mb-8">
                 <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                     <FaPlusCircle className="text-green-500" /> Quick Actions
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {actionCards.map((card, idx) => (
                           <motion.div whileHover={{ y: -5 }} key={idx}>
                               <Link 
                                    to={card.link}
                                    className={`${card.color} ${card.hover} text-white rounded-2xl p-6 shadow-lg flex flex-col h-full transition duration-300`}
                               >
                                    <div className="text-4xl mb-4 opacity-90">{card.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                                    <p className="text-white/80 flex-1">{card.description}</p>
                                    <div className="mt-4 font-bold text-sm tracking-wide uppercase flex items-center gap-2 opacity-90 group-hover:opacity-100 transition">
                                         Go to {card.title.split(' ')[1]} &rarr;
                                    </div>
                               </Link>
                           </motion.div>
                      ))}
                 </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Classroom Overview</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center text-gray-500 flex flex-col items-center">
                    <FaClipboardCheck className="text-5xl text-gray-300 mb-4" />
                    <p className="text-lg">Detailed charts mapping your students' progress will be displayed here.</p>
                    <p className="text-sm mt-2">Check back once students begin completing activities!</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
