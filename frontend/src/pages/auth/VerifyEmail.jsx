import { useState, useContext, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyEmail = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOTP, resendOTP } = useContext(AuthContext);

    const email = location.state?.email || '';

    useEffect(() => {
        if (inputRefs[0].current) {
            inputRefs[0].current.focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp = [...otp];
        pasteData.forEach((char, i) => {
            if (i < 6 && !isNaN(char)) {
                newOtp[i] = char;
            }
        });
        setOtp(newOtp);
        if (pasteData.length > 0) {
            const nextIdx = Math.min(pasteData.length, 5);
            inputRefs[nextIdx].current.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) return;

        setError('');
        setMessage('');
        setLoading(true);

        try {
            await verifyOTP(email, otpString);
            setMessage('Account activated! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        try {
            await resendOTP(email);
            setMessage('A fresh code has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] text-white p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/10"
                >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Verification Timeout</h2>
                    <p className="text-gray-400 mb-8 font-light">We couldn't verify your session. This usually happens if the page was refreshed.</p>
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-green-900/20 active:scale-95"
                    >
                        Back to Register
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f0a] text-white p-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-2xl bg-white/5 p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-white/10 relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                        className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/30"
                    >
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </motion.div>
                    <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Check your Mail</h2>
                    <p className="text-gray-400 font-light text-lg">
                        We sent a 6-digit code to <br />
                        <span className="text-green-400 font-medium">{email}</span>
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-8 text-sm text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}
                    {message && !error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-2xl mb-8 text-sm text-center font-medium"
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleVerify} className="space-y-10">
                    <div className="flex justify-between gap-3" onPaste={handlePaste}>
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                ref={inputRefs[index]}
                                value={data}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-16 sm:w-14 sm:h-20 bg-white/5 border border-white/10 rounded-2xl text-center text-3xl font-bold text-white focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200"
                            />
                        ))}
                    </div>

                    <div className="space-y-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading || otp.join('').length !== 6}
                            className={`w-full py-5 rounded-[1.25rem] font-bold text-xl transition-all duration-300 transform active:scale-[0.97] shadow-xl ${loading || otp.join('').length !== 6
                                    ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/30'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </span>
                            ) : 'Verify Account'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-gray-400 hover:text-green-400 text-sm font-medium transition-colors"
                            >
                                Didn't get the code? <span className="text-green-500 underline underline-offset-4 decoration-green-500/30">Resend OTP</span>
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
