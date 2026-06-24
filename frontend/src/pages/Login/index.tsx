import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--primary)] opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--surface-variant)] opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--secondary-container)] opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[var(--primary)]">AI Context Optimizer</h1>
          <p className="text-sm text-[var(--secondary)] mt-1">Convert documents into AI-ready Markdown</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-8 shadow-2xl border border-[var(--outline-variant)]"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-[var(--on-surface)] mb-2">Welcome back</h2>
            <p className="text-sm text-[var(--secondary)]">Sign in to access your dashboard</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl border-2 border-[var(--outline-variant)] bg-white text-[#1f1f1f] font-semibold text-sm hover:bg-gray-50 hover:border-[var(--outline)] hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--outline-variant)]" />
            <span className="text-xs text-[var(--secondary)]">Secure authentication</span>
            <div className="flex-1 h-px bg-[var(--outline-variant)]" />
          </div>

          {/* Trust points */}
          <div className="space-y-2">
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-green-500" />, text: 'Your files are encrypted and auto-deleted after conversion' },
              { icon: <Sparkles className="w-4 h-4 text-[var(--primary)]" />, text: '50 free conversions per day' },
              { icon: <Zap className="w-4 h-4 text-[var(--tertiary)]" />, text: 'Session auto-expires after 8 hours for your security' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                {icon}
                <span className="text-xs text-[var(--secondary)] leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-[var(--secondary)] mt-6"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-[var(--primary)] hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-[var(--primary)] hover:underline">Privacy Policy</a>.
        </motion.p>
      </div>
    </div>
  );
}
