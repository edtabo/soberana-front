'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/features/login/actions/actions';

interface SidebarProps {
  role: number | null;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      label: 'Usuarios',
      href: '/dashboard/users',
      visible: role === 1,
    },
    {
      label: 'Inventario',
      href: '/dashboard/inventory',
      visible: true,
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          item.visible && (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors duration-200"
        >
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
}
