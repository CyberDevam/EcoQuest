import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTree, FaTrophy, FaGraduationCap, FaSeedling } from 'react-icons/fa';

const LandingPage = () => {
    const features = [
        { icon: <FaGraduationCap />, title: "Interactive Lessons", desc: "Learn about the environment through bite-sized, engaging lessons and quizzes." },
        { icon: <FaSeedling />, title: "Real-world Challenges", desc: "Apply what you learn by completing eco-friendly tasks in your community." },
        { icon: <FaTrophy />, title: "Earn Rewards", desc: "Collect Eco-Points, level up, and unlock unique badges for your achievements." },
        { icon: <FaTree />, title: "Global Leaderboards", desc: "Compete with other students and schools to see who has the biggest green impact." }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-500 to-emerald-700 text-white flex-grow flex items-center pt-24 pb-32">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <FaLeaf className="text-6xl text-yellow-300 mb-6 drop-shadow-md inline-block animate-bounce" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg"
                    >
                        Gamify Your Green Impact.
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-4 max-w-2xl text-xl md:text-2xl text-green-50 mb-10 drop-shadow-sm font-medium"
                    >
                        Join EcoQuest today! Educational missions, real-world tasks, and competitive leaderboards to make saving the planet fun.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex space-x-4"
                    >
                        <Link to="/register" className="bg-yellow-400 text-green-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 shadow-xl transition transform hover:-translate-y-1">
                            Start Your Quest
                        </Link>
                        <Link to="/login" className="bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 shadow-xl transition border-2 border-transparent hover:border-green-200">
                            Login Log
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">How EcoQuest Works</h2>
                        <div className="w-24 h-1 bg-green-500 mx-auto mt-4 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {features.map((f, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-green-500 hover:shadow-2xl transition duration-300"
                            >
                                <div className="text-5xl text-emerald-500 mb-6 flex justify-center">{f.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">{f.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Need to import FaLeaf manually since it was missed at the top
import { FaLeaf } from 'react-icons/fa';

export default LandingPage;
