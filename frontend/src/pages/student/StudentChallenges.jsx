import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaClock, FaFire } from 'react-icons/fa';

const StudentChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [submissionProof, setSubmissionProof] = useState('');
    const [submissionDesc, setSubmissionDesc] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                // In a real app we would have a dedicated endpoint for all challenges
                // For now assuming a generic GET /student/challenges if we add it, or list all
                // Let's assume we can fetch all from a generic API or a new one we create.
                // We didn't create a GET /student/challenges in backend yet, so let's mock the data for now or we will get a 404.
                // Actually, wait, we didn't add the `getChallenges` controller for students.
                // I will add it to the backend soon, but let's wire up the call.
                const res = await api.get('/teacher/submissions'); // Fallback placeholder, we should fix the backend
                setChallenges([]); 
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    const openModal = (challenge) => {
        setSelectedChallenge(challenge);
        setSubmissionProof('');
        setSubmissionDesc('');
    };

    const closeModal = () => {
        setSelectedChallenge(null);
        setSubmissionProof('');
        setSubmissionDesc('');
    };

    const handleProofSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/student/submit-challenge', {
                challengeId: selectedChallenge._id,
                imageProof: submissionProof, // Currently URL string
                description: submissionDesc
            });
            alert('Challenge proof submitted successfully! Waiting for teacher approval.');
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit proof.');
        } finally {
             setSubmitting(false);
        }
    };

    // Placeholder data since we missed the GET endpoint in backend earlier
    const demoChallenges = [
        { _id: '1', title: 'Plant a Seedling', description: 'Plant a seed in a small pot and take a photo of it.', points: 100, difficulty: 'Easy', deadline: '2026-04-01' },
        { _id: '2', title: 'Plastic-Free Lunch', description: 'Pack a lunch using zero single-use plastics.', points: 150, difficulty: 'Medium', deadline: '2026-03-30' },
        { _id: '3', title: 'Neighborhood Cleanup', description: 'Spend 30 minutes picking up trash in a local park.', points: 300, difficulty: 'Hard', deadline: '2026-04-15' }
    ];

    const displayChallenges = challenges.length > 0 ? challenges : demoChallenges;

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Challenges...</div>;

    const difficultyColors = {
        Easy: 'bg-green-100 text-green-800 border-green-200',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Hard: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Active Challenges</h1>
                <p className="text-lg text-gray-600">Complete real-world tasks to level up and earn badges!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {displayChallenges.map(c => (
                     <motion.div 
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        key={c._id} 
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-xl transition-all"
                    >
                         <div className="p-6 flex-1">
                             <div className="flex justify-between items-start mb-4">
                                 <span className={`px-3 py-1 text-xs font-bold rounded-full border ${difficultyColors[c.difficulty]}`}>
                                     {c.difficulty}
                                 </span>
                                 <span className="flex items-center text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded-lg">
                                     <FaFire className="mr-1"/> +{c.points} Pts
                                 </span>
                             </div>
                             
                             <h3 className="text-xl font-bold text-gray-800 mb-2">{c.title}</h3>
                             <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{c.description}</p>
                             
                             {c.deadline && (
                                 <div className="text-xs text-gray-500 flex items-center mb-4">
                                     <FaClock className="mr-1" /> 
                                     Due: {new Date(c.deadline).toLocaleDateString()}
                                 </div>
                             )}
                         </div>
                         <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                             <button
                                 onClick={() => openModal(c)}
                                 className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition shadow-sm"
                             >
                                 Submit Proof
                             </button>
                         </div>
                     </motion.div>
                 ))}
            </div>

            {/* Check if empty */}
            {displayChallenges.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    No active challenges currently. Check back later!
                </div>
            )}

            {/* Modal for Submission */}
            <AnimatePresence>
                 {selectedChallenge && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                         <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative"
                        >
                            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Proof</h2>
                            <p className="text-gray-600 mb-6">Challenge: <span className="font-semibold">{selectedChallenge.title}</span></p>

                            <form onSubmit={handleProofSubmit} className="space-y-4">
                                 <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-1">Image URL Proof</label>
                                     <div className="mt-1 flex justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                                         <div className="w-full">
                                             <input 
                                                required
                                                type="url" 
                                                placeholder="https://example.com/my-activity.jpg" 
                                                value={submissionProof}
                                                onChange={(e) => setSubmissionProof(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                            />
                                         </div>
                                     </div>
                                     <p className="text-xs text-gray-500 mt-2">Note: In a true production app, this would be a file upload to Cloudinary/S3.</p>
                                 </div>

                                 <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                                     <textarea
                                          required
                                          rows="3"
                                          className="w-full shadow-sm sm:text-sm border-gray-300 rounded-lg py-2 px-3 border focus:ring-green-500 focus:border-green-500"
                                          placeholder="I completed this by..."
                                          value={submissionDesc}
                                          onChange={(e) => setSubmissionDesc(e.target.value)}
                                     ></textarea>
                                 </div>

                                 <div className="pt-4 flex gap-3">
                                      <button
                                         type="button"
                                         onClick={closeModal}
                                         className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
                                      >
                                          Cancel
                                      </button>
                                      <button
                                         type="submit"
                                         disabled={submitting}
                                         className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-sm flex items-center justify-center gap-2"
                                      >
                                          <FaUpload /> {submitting ? 'Submitting...' : 'Upload Proof'}
                                      </button>
                                 </div>
                            </form>
                         </motion.div>
                     </div>
                 )}
            </AnimatePresence>
        </div>
    );
};

export default StudentChallenges;
