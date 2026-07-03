import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, CloudUpload, Terminal, FileCode2,
  Bolt, ShieldCheck, ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--on-background)] font-sans">

      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--outline-variant)] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-black text-[var(--primary)]">AI Context Optimizer</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-[var(--secondary)]">
          <a href="#features" className="hover:text-[var(--primary)] transition-colors font-medium">Features</a>
          <a href="#how-it-works" className="hover:text-[var(--primary)] transition-colors font-medium">How It Works</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">

        {/* ── Hero ── */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
          <div className="lg:w-1/2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--secondary-container)] text-[var(--primary)] text-xs font-bold uppercase tracking-wider"
            >
              <Zap className="w-3 h-3" style={{ fill: 'currentColor' }} />
              Powered by Microsoft MarkItDown
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl font-black leading-tight tracking-tight"
            >
              Convert Documents into{' '}
              <span className="text-[var(--primary)]">AI-Ready Markdown</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[var(--secondary)] text-base leading-relaxed max-w-lg"
            >
              Reduce token costs and improve AI accuracy using Microsoft MarkItDown-powered document optimization.
              Transform messy files into structured, context-rich Markdown for LLMs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link to="/login">
                <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                  Get Started Free
                </Button>
              </Link>
              <Button variant="outline" size="lg">View Demo</Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-4 text-xs text-[var(--secondary)]"
            >
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-[var(--primary)]" /> 50/day free</span>
              <span className="flex items-center gap-1"><FileCode2 className="w-3.5 h-3.5" /> 7 formats</span>
            </motion.div>
          </div>

          {/* Workflow illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative bg-[var(--surface-container-lowest)] rounded-2xl shadow-2xl border border-[var(--outline-variant)] p-8">
              <div className="grid grid-cols-4 gap-3 items-center">
                {[
                  { icon: '📄', label: 'PDF / DOCX\nPPTX / IMG', delay: 0, bg: 'var(--secondary-container)' },
                  { icon: '⚡', label: 'AI CONTEXT\nOPTIMIZER', delay: 0.1, bg: 'var(--primary)', primary: true },
                  { icon: '#', label: 'STRUCTURED\nMARKDOWN', delay: 0.2, bg: 'var(--surface-container-highest)' },
                  { icon: '🤖', label: 'CLAUDE\nCHATGPT', delay: 0.3, bg: 'var(--inverse-surface)', dark: true },
                ].map(({ icon, label, delay, bg, primary, dark }) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + delay, duration: 0.5 }}
                    className={`flex flex-col items-center p-3 rounded-xl text-center animate-float${delay > 0 ? '-delay' : ''} ${primary ? 'shadow-lg scale-110' : ''}`}
                    style={{ background: bg }}
                  >
                    <span className={`text-2xl mb-1 ${primary ? 'filter brightness-0 invert' : ''}`}>{icon}</span>
                    <p className={`text-[9px] font-bold leading-tight ${dark || primary ? 'text-white' : 'text-[var(--secondary)]'}`}>
                      {label.split('\n').map((l, i) => <span key={i} className="block">{l}</span>)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Connecting arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-24 pointer-events-none">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-8 h-0.5 bg-gradient-to-r from-[var(--primary)] to-transparent opacity-40" />
                ))}
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-[var(--primary)] opacity-5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-[var(--surface-variant)] opacity-30 rounded-full blur-3xl" />
          </motion.div>
        </section>

        {/* ── Features Bento Grid ── */}
        <section id="features" className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Optimized for Professional Workflows</h2>
            <p className="text-[var(--secondary)] max-w-2xl mx-auto">Everything you need to feed clean, high-quality data to your favorite Large Language Models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Large card */}
            <motion.div
              custom={0} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
              className="md:col-span-2 p-7 rounded-2xl bg-[var(--surface-bright)] border border-[var(--outline-variant)] shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-3">
                  <div className="w-11 h-11 bg-[var(--secondary-container)] rounded-xl flex items-center justify-center">
                    <CloudUpload className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-bold">Multi-File Batch Upload</h3>
                  <p className="text-[var(--secondary)] text-sm leading-relaxed">
                    Process up to 10 files simultaneously. Drag and drop your entire project folder and watch it transform into an AI-ready library in seconds.
                  </p>
                </div>
                <div className="w-full md:w-48 h-32 bg-[var(--surface-container)] rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="flex gap-2 p-3">
                    {['PDF', 'DOCX', 'PPTX'].map((t) => (
                      <div key={t} className="w-10 h-12 bg-white rounded-lg shadow-sm border border-[var(--outline-variant)] flex items-center justify-center text-[9px] font-bold text-[var(--primary)]">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {[
              { icon: <Terminal className="w-5 h-5 text-[var(--primary)]" />, title: 'Powered by MarkItDown', desc: "Leveraging Microsoft's advanced library for hyper-accurate document parsing and conversion.", delay: 1 },
              { icon: <FileCode2 className="w-5 h-5 text-[var(--primary)]" />, title: 'AI-Ready Markdown', desc: 'Optimized structure specifically for context windows, preserving tables, hierarchy, and links.', delay: 2 },
              { icon: <Bolt className="w-5 h-5 text-[var(--primary)]" />, title: 'Fast Conversion', desc: 'Proprietary queue system ensures your files are converted in milliseconds, not minutes.', delay: 3 },
              { icon: <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />, title: 'Secure Processing', desc: 'Files are automatically deleted after conversion. Your documents never persist.', delay: 4 },
            ].map(({ icon, title, desc, delay }) => (
              <motion.div
                key={title}
                custom={delay} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
                className="p-7 rounded-2xl bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-[var(--secondary-container)] rounded-xl flex items-center justify-center mb-4">{icon}</div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-[var(--secondary)] leading-relaxed">{desc}</p>
              </motion.div>
            ))}

            {/* 30MB card */}
            <motion.div
              custom={5} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
              className="p-7 rounded-2xl bg-[var(--primary)] text-[var(--on-primary)] shadow-lg"
            >
              <div className="text-4xl font-black mb-1">30MB</div>
              <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-2">Max Upload Size</div>
              <p className="text-sm opacity-90">Process massive whitepapers and technical manuals without hitting file size limits.</p>
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="py-20">
          <div className="bg-[var(--surface-container-low)] rounded-3xl px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">How It Works</h2>
              <p className="text-[var(--secondary)]">Four simple steps to superior AI context.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Upload', desc: 'Drop your PDF, Word, or PowerPoint files into the dashboard.' },
                { step: '2', title: 'Convert', desc: 'Our engine parses structure and metadata using Microsoft MarkItDown.' },
                { step: '3', title: 'Download', desc: 'Get your clean .md file instantly or copy to clipboard.' },
                { step: '4', title: 'Use with AI', desc: 'Paste into LLMs for significantly better accuracy and lower costs.' },
              ].map(({ step, title, desc }, i) => (
                <motion.div
                  key={step}
                  custom={i} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
                  className="text-center space-y-3"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-[var(--outline-variant)]">
                    <span className="text-xl font-black text-[var(--primary)]">{step}</span>
                  </div>
                  <h4 className="font-bold">{title}</h4>
                  <p className="text-sm text-[var(--secondary)] leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-4xl font-black">Ready to optimize your workflow?</h2>
            <p className="text-[var(--secondary)]">Start converting your documents today and see the difference in your AI responses.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link to="/login">
                <Button variant="primary" size="lg">Get Started for Free</Button>
              </Link>
              <Button variant="outline" size="lg">View API Docs</Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--outline-variant)] py-10 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[var(--primary)] rounded flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="font-black text-[var(--primary)]">AI Context Optimizer</span>
            </div>
            <p className="text-xs text-[var(--secondary)]">© 2025 AI Context Optimizer. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm text-[var(--secondary)]">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--on-background)]">Product</span>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">About</a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">GitHub</a>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--on-background)]">Legal</span>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">Terms</a>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--on-background)]">Support</span>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">API Docs</a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
