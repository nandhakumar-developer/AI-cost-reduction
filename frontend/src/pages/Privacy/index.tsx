import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-16 max-w-3xl mx-auto">
      <Link to="/" className="text-[var(--primary)] text-sm font-semibold">← Back</Link>
      <h1 className="text-3xl font-black mt-6 mb-4">Privacy Policy</h1>
      <div className="prose text-[var(--secondary)] space-y-4 text-sm leading-relaxed">
        <p>We collect your Google account information (name, email, avatar) for authentication purposes only.</p>
        <p>Uploaded files are processed temporarily and deleted after conversion. Generated Markdown is stored in your account history.</p>
        <p>We use secure HTTP-only cookies for session management. Only one active session is allowed per user.</p>
        <p>We do not sell your personal data to third parties.</p>
      </div>
    </div>
  );
}
