import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { FaLeaf, FaSignOutAlt, FaUserCircle, FaTachometerAlt, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const nav = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        nav('/login');
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="bg-primary text-white shadow-md w-full z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to={user ? `/${user.role}/dashboard` : '/'} className="flex items-center space-x-2" onClick={closeMenu}>
                        <FaLeaf className="text-accent text-2xl animate-pulse" />
                        <span className="font-bold text-xl tracking-tight">EcoQuest</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="hover:text-accent font-medium transition duration-300">Login</Link>
                                <Link to="/register" className="bg-accent text-primary px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition duration-300 shadow-sm">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={`/${user.role}/dashboard`}
                                    className="flex items-center gap-1 hover:text-accent font-medium transition duration-300"
                                >
                                    <FaTachometerAlt />
                                    <span>Dashboard</span>
                                </Link>
                                <span className="font-medium flex items-center gap-2">
                                    <FaUserCircle className="text-xl" /> {user.name} ({user.ecoPoints} Pts)
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-red-200 hover:text-white transition duration-300 ml-4 font-semibold p-2 rounded-lg hover:bg-green-700"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden text-2xl focus:outline-none hover:text-accent transition duration-300"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden bg-primary border-t border-green-700 px-4 pb-4 pt-2 space-y-3 animate-fade-in">
                    {!user ? (
                        <>
                            <Link to="/login" onClick={closeMenu} className="block hover:text-accent font-medium transition duration-300 py-2">
                                Login
                            </Link>
                            <Link to="/register" onClick={closeMenu} className="block bg-accent text-primary px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition duration-300 shadow-sm text-center">
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 py-2 border-b border-green-700 pb-3">
                                <FaUserCircle className="text-xl" />
                                <span className="font-medium">{user.name} ({user.ecoPoints} Pts)</span>
                            </div>
                            <Link
                                to={`/${user.role}/dashboard`}
                                onClick={closeMenu}
                                className="flex items-center gap-2 hover:text-accent font-medium transition duration-300 py-2"
                            >
                                <FaTachometerAlt />
                                <span>Dashboard</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-red-200 hover:text-white transition duration-300 font-semibold py-2 w-full"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export const Layout = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
                <Outlet />
            </main>
            <footer className="bg-gray-800 text-white py-6 text-center shadow-inner mt-auto">
                <p>&copy; 2026 EcoQuest Educational Platform. All rights reserved.</p>
                <p className="text-sm text-gray-400 mt-2">Empowering students for a sustainable future.</p>
            </footer>
        </div>
    );
};
