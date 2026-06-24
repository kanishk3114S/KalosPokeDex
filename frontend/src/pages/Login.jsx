import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${baseUrl}${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F1D] p-4 relative overflow-hidden"
    >
      {/* Background visual flair */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00E5FF] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-1000"></div>

      <div className="w-full text-center mb-8 text-xs font-light tracking-widest text-[#A0AEC0] uppercase relative z-10">
        Kalos Dex "One step ahead of mega evolution"
      </div>

      <div className="w-full max-w-md glass rounded-3xl shadow-2xl overflow-hidden relative z-10 hover-wave">
        <div className="p-10">
          <div className="flex justify-center mb-10">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <svg className="w-16 h-16 text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.6)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4">
                  <circle cx="50" cy="50" r="45" />
                  <path d="M 5 50 L 95 50" />
                  <circle cx="50" cy="50" r="14" fill="currentColor" />
                </svg>
                <svg className="w-6 h-6 absolute -bottom-1 -right-1 text-gray-300 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h4l6-12 6 12h4L12 2z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-gray-300 to-[#00E5FF] bg-clip-text text-transparent">
                THE MEGA WORLD
              </h1>
            </div>
          </div>
          
          <h2 className="text-xl font-medium mb-8 text-center text-gray-300 tracking-wide uppercase">
            {isRegister ? 'Initialize Trainer Profile' : 'Authenticate Trainer'}
          </h2>

          {error && <div className="mb-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3 rounded-xl border border-white/10 bg-black/20 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all placeholder-gray-500"
                  placeholder="e.g. Calem"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Email Data</label>
              <input 
                type="email" 
                className="w-full px-5 py-3 rounded-xl border border-white/10 bg-black/20 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all placeholder-gray-500"
                placeholder="trainer@kalos.net"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 text-gray-300 uppercase tracking-wider">Passcode</label>
              <input 
                type="password" 
                className="w-full px-5 py-3 rounded-xl border border-white/10 bg-black/20 text-white focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all placeholder-gray-500"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 mt-8 bg-[#00E5FF] hover:bg-[#00b8cc] text-black rounded-xl font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] cursor-pointer"
            >
              {isRegister ? 'Register' : 'Access Data'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-400">
            {isRegister ? 'Already registered?' : "No profile found?"}
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-[#00E5FF] font-bold hover:underline cursor-pointer"
            >
              {isRegister ? 'Authenticate' : 'Initialize'}
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
