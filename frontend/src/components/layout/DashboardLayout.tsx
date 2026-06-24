import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <TopBar />
        <main className="flex-1 p-6 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
