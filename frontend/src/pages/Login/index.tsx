import { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

function LoginContent() {
  const { isAuthenticated } = useAuthStore();
  const { loginWithGoogle, loginWithDev } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    setLoading(true);
    try {
      await loginWithGoogle(response.credential);
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = async () => {
    setLoading(true);
    try {
      await loginWithDev('admin@markitdown.local');
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
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-12 h-12 bg-[var(--primary)] flex items-center justify-center rounded-xl mb-4">
            <Zap className="w-6 h-6 text-white" style={{ fill: 'currentColor' }} />
          </div>
          <h1 className="text-2xl font-black text-[var(--primary)]">MarkItDown SaaS</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--surface-container-lowest)] rounded-xl border border-[var(--outline-variant)] p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-[var(--on-surface)] mb-1">Welcome</h2>
            <p className="text-sm text-[var(--secondary)]">Sign in with Google to continue</p>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            {GOOGLE_CLIENT_ID ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {}}
                theme="outline"
                size="large"
                text="continue_with"
                width="100%"
              />
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={loading}
                onClick={handleDevLogin}
              >
                {loading ? 'Signing in…' : 'Continue with Google (Dev Mode)'}
              </Button>
            )}

            {!GOOGLE_CLIENT_ID && (
              <p className="text-xs text-[var(--secondary)] text-center">
                Set VITE_GOOGLE_CLIENT_ID for real Google OAuth. Dev mode uses backend ALLOW_DEV_AUTH.
              </p>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--secondary)]">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--secondary)]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)]">
              Secure Google OAuth only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  if (GOOGLE_CLIENT_ID) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LoginContent />
      </GoogleOAuthProvider>
    );
  }
  return <LoginContent />;
}
