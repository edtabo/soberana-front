import { getUserRole } from '@/utils/auth';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
