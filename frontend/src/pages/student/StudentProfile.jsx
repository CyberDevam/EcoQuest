import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaUserGraduate, FaEnvelope, FaSchool, FaTrophy, FaLeaf } from 'react-icons/fa';

const StudentProfile = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="p-10 text-center">Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Profile</h1>
                <p className="text-lg text-gray-600">Track your personal growth and impact.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-10">
                 {/* Top Banner section */}
                 <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-32 w-full"></div>
                 
                 <div className="px-8 pb-8 flex flex-col items-center -mt-16">
                      <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg mb-4">
                           <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center text-5xl text-green-600 border-4 border-emerald-500">
                               <FaUserGraduate />
                           </div>
                      </div>
                      
                      <h2 className="text-3xl font-extrabold text-gray-900">{user.name}</h2>
                      <p className="text-lg text-emerald-600 font-bold mb-4 flex items-center gap-2">
                           <FaLeaf /> Level: {user.level || 'Seed'}
                      </p>

                      <div className="w-full max-w-lg mt-4 bg-gray-50 rounded-xl p-6 border border-gray-100">
                          <div className="space-y-4">
                              <div className="flex items-center text-gray-700">
                                  <FaEnvelope className="text-gray-400 w-6 h-6 mr-3" />
                                  <span className="font-medium">{user.email}</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                  <FaSchool className="text-gray-400 w-6 h-6 mr-3" />
                                  <span className="font-medium">{user.school || 'EcoQuest Academy'}</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                  <FaTrophy className="text-yellow-400 w-6 h-6 mr-3" />
                                  <span className="font-bold text-green-700 text-lg">{user.ecoPoints} Total Points</span>
                              </div>
                          </div>
                      </div>
                 </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                 <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Account Settings</h3>
                 <p className="text-gray-500 mb-4">Settings functionality to change password, update profile picture, or manage notification preferences will go here in the future.</p>
                 <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition cursor-not-allowed opacity-50">
                     Edit Profile (Coming Soon)
                 </button>
            </div>
        </div>
    );
};

export default StudentProfile;
