import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-900">
            <div className="text-green-500 text-xl font-bold animate-pulse">
                Loading EcoQuest...
            </div>
        </div>
    );
    
    if (!user) return <Navigate to="/login" replace />;
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    
    return children;
};

export default ProtectedRoute;
