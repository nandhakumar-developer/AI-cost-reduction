import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-center px-6">
      <h1 className="text-6xl font-black text-[var(--primary)]">404</h1>
      <p className="text-xl font-bold mt-4">Page not found</p>
      <p className="text-[var(--secondary)] mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-8"><Button>Go Home</Button></Link>
    </div>
  );
}
