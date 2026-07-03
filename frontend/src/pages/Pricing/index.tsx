import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '../../components/common/Button';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['8MB combined upload', '8MB conversion quota', '42-hour reset', 'Google OAuth', 'Conversion history'],
  },
  {
    name: 'Pro',
    price: '$9.99/mo',
    features: ['15MB combined upload', '15MB quota per cycle', '10 conversion cycles', '42-hour reset', 'Priority support'],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="flex justify-between items-center px-6 h-16 border-b border-[var(--outline-variant)]">
        <Link to="/" className="flex items-center gap-2 font-black text-[var(--primary)]">
          <Zap className="w-5 h-5" /> MarkItDown
        </Link>
        <Link to="/login"><Button size="sm">Sign In</Button></Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black mb-4">
          Simple Pricing
        </motion.h1>
        <p className="text-[var(--secondary)] mb-12">Convert documents to AI-ready Markdown.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-8 border text-left ${plan.highlighted ? 'border-[var(--primary)] bg-[var(--secondary-container)] shadow-lg' : 'border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]'}`}
            >
              <h3 className="text-xl font-black">{plan.name}</h3>
              <p className="text-3xl font-black mt-2 text-[var(--primary)]">{plan.price}</p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--secondary)]">
                    <Check className="w-4 h-4 text-green-600" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block mt-8">
                <Button variant={plan.highlighted ? 'primary' : 'outline'} className="w-full">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
