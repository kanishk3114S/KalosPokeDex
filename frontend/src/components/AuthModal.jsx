import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, X, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { modalBackdropVariants, modalDialogVariants } from '../constants/animations';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authPromptReason, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const data = await register(formData.username, formData.email, formData.password);
        if (!data.session) {
          setSuccessMsg('Profile created! Check your email inbox to verify your account.');
        }
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={closeAuthModal}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl glass p-7 sm:p-8 border border-white/15 shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden"
        >
          {/* Holographic corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#00E5FF]/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#FF3366]/20 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Kalos Holo-Caster Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#FF3366]/20 border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <Sparkles className="w-6 h-6 text-[#00E5FF] animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">
              {isRegister ? 'Initialize Trainer ID' : 'Holo-Caster Access'}
            </h2>
            <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">
              Kalos Pokédex • 9th-Gen Terminal
            </p>
          </div>

          {authPromptReason && (
            <div className="mb-5 p-3 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0" />
              <span>{authPromptReason}</span>
            </div>
          )}

          {/* Tab selector */}
          <div className="grid grid-cols-2 p-1 mb-5 rounded-xl bg-black/40 border border-white/10 text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !isRegister ? 'bg-[#00E5FF] text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn size={14} />
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isRegister ? 'bg-[#FF3366] text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus size={14} />
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 text-red-200 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-start gap-2">
              <ShieldCheck size={16} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Trainer Call-Sign (Username)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serena or Calem"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Trainer Email
              </label>
              <input
                type="email"
                required
                placeholder="trainer@kalos.net"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg ${
                isRegister
                  ? 'bg-gradient-to-r from-[#FF3366] to-pink-600 text-white shadow-pink-500/25 hover:shadow-pink-500/40'
                  : 'bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-black shadow-cyan-500/25 hover:shadow-cyan-500/40'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Transmitting Data...' : isRegister ? 'Create Profile' : 'Authenticate Trainer'}
            </motion.button>
          </form>

          {/* Guest dismiss */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span>Prefer not to sign in?</span>
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-[#00E5FF] font-bold hover:underline cursor-pointer"
            >
              Continue as Guest &rarr;
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
