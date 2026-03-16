import { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaImage } from 'react-icons/fa';

const ReviewSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await api.get('/teacher/submissions');
            setSubmissions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (submissionId, status) => {
        try {
            await api.put('/teacher/review-submission', {
                submissionId,
                status // 'approved' or 'rejected'
            });
            // Update local state to remove or update the reviewed item
            setSubmissions(prev => prev.map(s => s._id === submissionId ? { ...s, status } : s));
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating submission');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading submissions...</div>;

    const pendingSubmissions = submissions.filter(s => s.status === 'pending');
    const reviewedSubmissions = submissions.filter(s => s.status !== 'pending');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-10 p-6 rounded-2xl bg-white shadow-sm border border-gray-100 flex justify-between items-center">
                 <div>
                     <h1 className="text-3xl font-extrabold text-gray-900">Review Submissions</h1>
                     <p className="text-gray-500 mt-1">Verify student proofs and award points.</p>
                 </div>
                 <div className="bg-orange-100 text-orange-800 font-bold px-4 py-2 rounded-lg border border-orange-200 shadow-sm">
                     {pendingSubmissions.length} Pending Review
                 </div>
            </header>

            {pendingSubmissions.length === 0 && (
                 <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                     <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
                     <h2 className="text-2xl font-bold text-gray-700">All Caught Up!</h2>
                     <p className="text-gray-500 mt-2">There are no pending submissions to review.</p>
                 </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <AnimatePresence>
                     {pendingSubmissions.map(sub => (
                         <motion.div 
                             key={sub._id}
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.9, height: 0 }}
                             className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col"
                         >
                             {/* Proof Image Wrapper */}
                             <div className="relative h-48 bg-gray-100 flex items-center justify-center border-b border-gray-100">
                                  {sub.imageProof ? (
                                      <img src={sub.imageProof} alt="Proof" className="w-full h-full object-cover" 
                                           onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Invalid+Image+URL'; }}
                                      />
                                  ) : (
                                       <FaImage className="text-5xl text-gray-300" />
                                  )}
                                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold backdrop-blur-md">
                                      {sub.challengeId?.title}
                                  </div>
                             </div>
                             
                             <div className="p-6 flex-1 flex flex-col">
                                  <div className="flex justify-between items-start mb-4">
                                       <div>
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Student</p>
                                            <p className="text-lg font-bold text-gray-900">{sub.studentId?.name}</p>
                                       </div>
                                       <div className="text-right">
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Points</p>
                                            <p className="text-lg font-bold text-yellow-600">+{sub.challengeId?.points}</p>
                                       </div>
                                  </div>
                                  
                                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex-1">
                                      <p className="text-sm font-bold text-gray-700 mb-1">Student Notes:</p>
                                      <p className="text-gray-600 text-sm italic">"{sub.description || 'No notes provided.'}"</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mt-auto">
                                      <button 
                                          onClick={() => handleReview(sub._id, 'rejected')}
                                          className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 py-3 rounded-xl font-bold transition"
                                      >
                                          <FaTimesCircle /> Reject
                                      </button>
                                      <button 
                                          onClick={() => handleReview(sub._id, 'approved')}
                                          className="flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 py-3 rounded-xl font-bold shadow-md transition transform hover:-translate-y-0.5"
                                      >
                                          <FaCheckCircle /> Approve
                                      </button>
                                  </div>
                             </div>
                         </motion.div>
                     ))}
                 </AnimatePresence>
            </div>

            {reviewedSubmissions.length > 0 && (
                 <div className="mt-16">
                      <h3 className="text-xl font-bold text-gray-800 mb-6">Recently Reviewed</h3>
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                          <table className="w-full text-left border-collapse">
                              <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500 tracking-wider">
                                      <th className="p-4 font-bold">Student</th>
                                      <th className="p-4 font-bold">Challenge</th>
                                      <th className="p-4 font-bold">Status</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {reviewedSubmissions.map(sub => (
                                      <tr key={sub._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                          <td className="p-4 font-medium text-gray-900">{sub.studentId?.name}</td>
                                          <td className="p-4 text-gray-600">{sub.challengeId?.title}</td>
                                          <td className="p-4 text-gray-600 font-bold">
                                              {sub.status === 'approved' 
                                                  ? <span className="text-green-600 bg-green-50 px-3 py-1 rounded border border-green-200">Approved</span>
                                                  : <span className="text-red-500 bg-red-50 px-3 py-1 rounded border border-red-200">Rejected</span>
                                              }
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                 </div>
            )}
        </div>
    );
};

export default ReviewSubmissions;
