import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateChallenge = () => {
    const nav = useNavigate();
    const [challengeData, setChallengeData] = useState({
        title: '',
        description: '',
        difficulty: 'Easy',
        points: 50,
        deadline: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setChallengeData({...challengeData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/teacher/create-challenge', challengeData);
            alert('Challenge published successfully!');
            nav('/teacher/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating challenge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                 <div className="bg-orange-500 px-8 py-6">
                     <h1 className="text-2xl font-extrabold text-white">Create Real-World Challenge</h1>
                     <p className="text-orange-100 mt-1">Inspire students to take action offline.</p>
                 </div>
                 
                 <form onSubmit={handleSubmit} className="p-8 space-y-6">
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Challenge Title</label>
                         <input required name="title" type="text" value={challengeData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500" placeholder="e.g., Plastic-Free Weekend" />
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Description & Instructions</label>
                         <textarea required name="description" value={challengeData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500" placeholder="Explain what students need to do and how to prove it..." rows="4"></textarea>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Difficulty</label>
                             <select name="difficulty" value={challengeData.difficulty} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white">
                                 <option>Easy</option>
                                 <option>Medium</option>
                                 <option>Hard</option>
                             </select>
                         </div>
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Points Reward</label>
                             <input required name="points" type="number" min="10" step="10" value={challengeData.points} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500" />
                         </div>
                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Deadline</label>
                             <input name="deadline" type="date" value={challengeData.deadline} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500" />
                         </div>
                     </div>
                     
                     <div className="pt-6">
                         <button disabled={loading} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg">
                             {loading ? 'Publishing...' : 'Publish Challenge'}
                         </button>
                     </div>
                 </form>
             </div>
        </div>
    );
};

export default CreateChallenge;
