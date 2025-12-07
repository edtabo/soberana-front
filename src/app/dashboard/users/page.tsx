import { getUsers } from '@/features/users/actions/actions';
import DataTableComponent from '@/components/DataTable';
import Link from 'next/link';
import PageNotification from '@/components/PageNotification';

export default async function UsersPage() {
  const usersResponse = await getUsers();

  const users = Array.isArray(usersResponse) ? usersResponse : [];
  
  const columns = ['id', 'email', 'name', 'role'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <Link
          href="/dashboard/users/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Nuevo Usuario
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden p-6">
        <DataTableComponent data={users} columns={columns} editPath="/dashboard/users" />
      </div>
      <PageNotification />
    </div>
  );
}
