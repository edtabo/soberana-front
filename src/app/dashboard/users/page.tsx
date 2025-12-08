'use client';

import { getUsers, deleteUser } from '@/features/users/actions/actions';
import DataTableComponent from '@/components/DataTable';
import Link from 'next/link';
import PageNotification from '@/components/PageNotification';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const columns = ['id', 'email', 'name', 'role'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await getUsers();
        setUsers(Array.isArray(usersResponse) ? usersResponse : []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersResponse = await getUsers();
      setUsers(Array.isArray(usersResponse) ? usersResponse : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteUser(id);
      if (result.success) {
        // Refresh the users list after successful deletion
        await fetchUsers();
      }
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Error al procesar la solicitud' };
    }
  };

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
        <DataTableComponent 
          data={users} 
          columns={columns} 
          editPath="/dashboard/users"
          onDelete={handleDelete}
        />
      </div>
      <PageNotification />
    </div>
  );
}
