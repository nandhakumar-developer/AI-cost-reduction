import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  // 3D tilt effect (from Stitch Sign In screen)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const x = (e.clientX - window.innerWidth / 2) / 120;
      const y = (e.clientY - window.innerHeight / 2) / 120;
      card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
    };
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--outline-variant) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      {/* Bottom gradient decoration */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-40">
        <div className="h-64 bg-gradient-to-t from-[var(--secondary-container)] to-transparent blur-3xl translate-y-32" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div
            className="w-12 h-12 bg-[var(--primary)] flex items-center justify-center rounded-xl mb-4"
            style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)' }}
          >
            <Zap className="w-6 h-6 text-white" style={{ fill: 'currentColor' }} />
          </div>
          <h1 className="text-2xl font-black text-[var(--primary)]">AI Context Optimizer</h1>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--surface-container-lowest)] rounded-xl border border-[var(--outline-variant)] p-8 transition-transform duration-200"
          style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)' }}
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-[var(--on-surface)] mb-1">Welcome back</h2>
            <p className="text-sm text-[var(--secondary)]">Sign in to continue to your workspace</p>
          </div>

          {/* Google Sign In */}
          <div className="space-y-4">
            <button
              id="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] rounded-lg py-3 px-4 text-base font-semibold text-[var(--on-surface)] transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5 hover:bg-[var(--surface-container-low)] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[var(--outline-variant)]" />
              <span className="flex-shrink mx-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)]">or</span>
              <div className="flex-grow border-t border-[var(--outline-variant)]" />
            </div>

            {/* Email Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)] ml-1" htmlFor="email">
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-[var(--surface-bright)] border border-[var(--outline-variant)] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary-container)] focus:border-[var(--primary)] outline-none transition-all text-[var(--on-surface)] placeholder:text-[var(--secondary)]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)] ml-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[var(--surface-bright)] border border-[var(--outline-variant)] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary-container)] focus:border-[var(--primary)] outline-none transition-all text-[var(--on-surface)] placeholder:text-[var(--secondary)]"
                />
              </div>
              <button
                type="submit"
                id="email-signin-btn"
                className="w-full bg-[var(--primary)] text-[var(--on-primary)] font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity active:scale-[0.98] text-sm"
              >
                Continue with Email
              </button>
            </form>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--secondary)]">
              By continuing, you agree to our{' '}
              <a href="#" className="text-[var(--primary)] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[var(--primary)] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex justify-center gap-6"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--secondary)]" style={{ fill: 'currentColor' }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)]">SOC2 Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)]">Enterprise Ready</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
