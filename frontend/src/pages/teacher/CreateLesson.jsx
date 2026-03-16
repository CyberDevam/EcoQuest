import { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CreateLesson = () => {
    const nav = useNavigate();
    const [lessonData, setLessonData] = useState({
        title: '',
        description: '',
        content: '',
        media: '',
        pointsReward: 20
    });
    
    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleLessonChange = (e) => {
        setLessonData({...lessonData, [e.target.name]: e.target.value});
    };

    const addQuestion = () => {
        setQuizData([...quizData, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    };

    const removeQuestion = (idx) => {
        const filtered = quizData.filter((_, i) => i !== idx);
        setQuizData(filtered);
    };

    const handleQuestionChange = (idx, field, value) => {
        const updated = [...quizData];
        updated[idx][field] = value;
        setQuizData(updated);
    };

    const handleOptionChange = (qIdx, optIdx, value) => {
        const updated = [...quizData];
        updated[qIdx].options[optIdx] = value;
        setQuizData(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/teacher/create-lesson', {
                ...lessonData,
                quiz: quizData
            });
            alert('Lesson created successfully!');
            nav('/teacher/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating lesson');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 px-8 py-6">
                     <h1 className="text-2xl font-extrabold text-white">Create New Lesson</h1>
                     <p className="text-blue-100 mt-1">Design an interactive learning experience.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                     {/* Basics */}
                     <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Lesson Title</label>
                              <input required name="title" type="text" value={lessonData.title} onChange={handleLessonChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., The Impact of Ocean Plastics" />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                              <textarea required name="description" value={lessonData.description} onChange={handleLessonChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="Brief summary for the catalogue..." rows="2"></textarea>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Full Content (Text/HTML)</label>
                              <textarea required name="content" value={lessonData.content} onChange={handleLessonChange} className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50" placeholder="<h2>Welcome</h2><p>Here is the reading material...</p>" rows="6"></textarea>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Media URL (Image/Video)</label>
                                  <input name="media" type="url" value={lessonData.media} onChange={handleLessonChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" placeholder="https://..." />
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-1">Points Reward</label>
                                  <input name="pointsReward" type="number" min="0" value={lessonData.pointsReward} onChange={handleLessonChange} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" />
                              </div>
                          </div>
                     </div>

                     <hr className="border-gray-200" />

                     {/* Quiz Builder */}
                     <div>
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-extrabold text-gray-800">Quiz Questions (Optional)</h3>
                              <button type="button" onClick={addQuestion} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition">
                                  <FaPlus /> Add Question
                              </button>
                          </div>
                          
                          <div className="space-y-6">
                              {quizData.map((q, qIdx) => (
                                  <div key={qIdx} className="bg-gray-50 border border-gray-200 p-6 rounded-xl relative">
                                      <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                                          <FaTrash />
                                      </button>
                                      
                                      <div className="mb-4">
                                          <label className="block text-sm font-bold text-gray-700 mb-1">Question {qIdx + 1}</label>
                                          <input required type="text" value={q.question} onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" placeholder="What is..." />
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-3 mb-4">
                                           {q.options.map((opt, oIdx) => (
                                               <div key={oIdx}>
                                                   <label className="block text-xs font-bold text-gray-500 mb-1">Option {oIdx + 1}</label>
                                                   <input required type="text" value={opt} onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm" placeholder={`Option ${oIdx + 1}`} />
                                               </div>
                                           ))}
                                      </div>
                                      
                                      <div>
                                          <label className="block text-sm font-bold text-gray-700 mb-1">Correct Answer (Must match an option exactly)</label>
                                          <select required value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)} className="w-full border border-gray-300 rounded-lg p-2">
                                              <option value="" disabled>Select the correct option...</option>
                                              {q.options.filter(o => o.trim() !== '').map((opt, idx) => (
                                                  <option key={idx} value={opt}>{opt}</option>
                                              ))}
                                          </select>
                                      </div>
                                  </div>
                              ))}
                          </div>
                     </div>

                     <div className="pt-6">
                         <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg">
                             {loading ? 'Publishing...' : 'Publish Lesson'}
                         </button>
                     </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLesson;
