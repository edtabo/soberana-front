import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getUserById, getWarehouses } from '@/features/users/actions/actions';
import UserUpdateForm from '@/features/users/components/UserUpdateForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateUserPage({ params }: PageProps) {
  const { id } = await params;
  
  const [user, warehouses] = await Promise.all([
    getUserById(id),
    getWarehouses(),
  ]);

  if (!user) {
    return (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">Error:</span> Usuario no encontrado.
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Actualizar Usuario</h1>
        <p className="text-gray-600">Modifique los datos del usuario.</p>
      </div>
      
      <UserUpdateForm user={user} warehouses={warehouses} />
    </div>
  );
}
