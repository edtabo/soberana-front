import { getWarehouses } from '@/features/users/actions/actions';
import UserForm from '@/features/users/components/UserForm';

export default async function CreateUserPage() {
  const warehouses = await getWarehouses();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Usuario</h2>
        <p className="text-gray-500">Complete el formulario para registrar un nuevo usuario en el sistema.</p>
      </div>
      
      <UserForm warehouses={warehouses} />
    </div>
  );
}
