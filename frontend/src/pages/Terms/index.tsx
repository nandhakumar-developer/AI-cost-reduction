import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-16 max-w-3xl mx-auto">
      <Link to="/" className="text-[var(--primary)] text-sm font-semibold">← Back</Link>
      <h1 className="text-3xl font-black mt-6 mb-4">Terms of Service</h1>
      <div className="prose text-[var(--secondary)] space-y-4 text-sm leading-relaxed">
        <p>By using MarkItDown SaaS, you agree to upload only files you have the right to process.</p>
        <p>Free users are limited to 8MB combined uploads and an 8MB conversion quota per 42-hour period.</p>
        <p>Pro subscriptions are activated manually after payment verification by an administrator.</p>
        <p>We reserve the right to ban accounts that abuse the service or upload malicious files.</p>
      </div>
    </div>
  );
}
