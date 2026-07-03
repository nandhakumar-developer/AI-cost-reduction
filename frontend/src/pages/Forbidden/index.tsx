import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '../../components/common/Button';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-center px-6">
      <ShieldOff className="w-16 h-16 text-[var(--error)] mb-4" />
      <h1 className="text-4xl font-black">403</h1>
      <p className="text-xl font-bold mt-4">Access Denied</p>
      <p className="text-[var(--secondary)] mt-2">You don't have permission to view this page.</p>
      <Link to="/dashboard" className="mt-8"><Button>Back to Dashboard</Button></Link>
    </div>
  );
}
