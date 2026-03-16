import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Layout & Pages
import { Layout } from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

// Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentLessons from './pages/student/StudentLessons';
import StudentLessonView from './pages/student/StudentLessonView';
import StudentChallenges from './pages/student/StudentChallenges';
import StudentProfile from './pages/student/StudentProfile';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateLesson from './pages/teacher/CreateLesson';
import CreateChallenge from './pages/teacher/CreateChallenge';
import ReviewSubmissions from './pages/teacher/ReviewSubmissions';

import AdminDashboard from './pages/admin/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/lessons" element={<ProtectedRoute allowedRoles={['student']}><StudentLessons /></ProtectedRoute>} />
            <Route path="/student/lesson/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentLessonView /></ProtectedRoute>} />
            <Route path="/student/challenges" element={<ProtectedRoute allowedRoles={['student']}><StudentChallenges /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/create-lesson" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><CreateLesson /></ProtectedRoute>} />
            <Route path="/teacher/create-challenge" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><CreateChallenge /></ProtectedRoute>} />
            <Route path="/teacher/submissions" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><ReviewSubmissions /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
