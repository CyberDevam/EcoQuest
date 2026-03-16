import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const StudentLessonView = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [quizResult, setQuizResult] = useState(null);
    const { updatePoints, updateLevel, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                // Get all lessons and filter since we don't have a single lesson endpoint configured yet
                const res = await api.get('/student/lessons');
                const found = res.data.find(l => l._id === id);
                setLesson(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    const handleAnswerChange = (qIndex, answer) => {
        setAnswers({...answers, [qIndex]: answer});
    };

    const handleQuizSubmit = async () => {
        let correctCount = 0;
        lesson.quiz.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correctCount++;
        });
        
        try {
            const res = await api.post('/student/submit-quiz', {
                lessonId: lesson._id,
                score: correctCount
            });
            
            setQuizResult({
                score: correctCount,
                total: lesson.quiz.length,
                points: res.data.pointsEarned
            });
            setSubmitted(true);
            updatePoints(res.data.totalPoints);
            updateLevel(res.data.newLevel);
            
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit quiz');
        }
    };

    if (loading) return <div className="p-10 text-center text-green-600 font-bold">Loading Lesson...</div>;
    if (!lesson) return <div className="p-10 text-center text-red-600 font-bold">Lesson not found.</div>;

    const isAlreadyCompleted = user.completedLessons?.includes(lesson._id);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{lesson.title}</h1>
                <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mb-6"></div>
                {lesson.media && <img src={lesson.media} alt="Lesson Cover" className="w-full h-64 object-cover rounded-2xl shadow-md mb-8" />}
            </header>

            {/* Content */}
            <article className="prose prose-lg prose-green max-w-none mb-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 leading-relaxed text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </article>

            {/* Quiz Section */}
            {lesson.quiz && lesson.quiz.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 shadow-inner border border-green-200">
                    <h2 className="text-3xl font-extrabold text-green-900 mb-6 flex items-center gap-3">
                        <FaExclamationCircle className="text-yellow-500" />
                        Knowledge Check
                    </h2>
                    
                    {isAlreadyCompleted ? (
                        <div className="bg-white p-6 rounded-2xl text-center shadow-sm border border-green-200">
                             <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                             <h3 className="text-2xl font-bold text-gray-800">You've already completed this lesson!</h3>
                             <p className="text-gray-600 mt-2">Points have been awarded. Re-visit other lessons or complete new challenges.</p>
                             <button onClick={() => navigate('/student/lessons')} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition">
                                 Back to Lessons
                             </button>
                        </div>
                    ) : submitted ? (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-8 rounded-2xl text-center shadow-lg border-2 border-green-400"
                        >
                             <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                             <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Completed!</h3>
                             <p className="text-xl text-gray-600">You scored <span className="font-bold text-green-600">{quizResult.score} / {quizResult.total}</span></p>
                             <div className="my-6 inline-block bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-xl font-bold text-lg shadow-sm">
                                 Earned +{quizResult.points} Eco-Points
                             </div>
                             <div>
                                 <button onClick={() => navigate('/student/dashboard')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition">
                                     Go to Dashboard
                                 </button>
                             </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-8">
                            {lesson.quiz.map((q, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                                    <p className="font-bold text-lg text-gray-800 mb-4">{idx + 1}. {q.question}</p>
                                    <div className="space-y-3">
                                        {q.options.map((opt, oIdx) => (
                                            <label key={oIdx} className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition group">
                                                <input 
                                                    type="radio" 
                                                    name={`q-${idx}`} 
                                                    value={opt}
                                                    onChange={() => handleAnswerChange(idx, opt)}
                                                    className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded-full cursor-pointer"
                                                />
                                                <span className="ml-3 text-gray-700 font-medium group-hover:text-green-800">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={handleQuizSubmit}
                                disabled={Object.keys(answers).length !== lesson.quiz.length}
                                className={`w-full py-4 rounded-xl font-bold text-xl transition shadow-lg ${
                                    Object.keys(answers).length === lesson.quiz.length
                                        ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                                        : 'bg-green-300 text-green-50 cursor-not-allowed border-transparent'
                                }`}
                            >
                                Submit Answers
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentLessonView;
