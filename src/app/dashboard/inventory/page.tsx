import { getProducts, getWarehouses } from '@/features/inventory/actions/actions';
import { getUserRole } from '@/utils/auth';
import { Roles } from '@/utils/enums';
import InventoryFormClient from '@/features/inventory/components/InventoryFormClient';
import InventoryFormAdmin from '@/features/inventory/components/InventoryFormAdmin';

export default async function InventoryPage() {
  const [warehouses, products] = await Promise.all([
    getWarehouses(),
    getProducts()
  ]);

  const role = await getUserRole();

  if (role === Roles.ADMIN) {
    return <InventoryFormAdmin />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Inventario</h2>
        <p className="text-gray-500">Complete el formulario para registrar un nuevo item de inventario.</p>
      </div>
      
      <InventoryFormClient 
        warehouses={warehouses || []} 
        products={products || []}
      />
    </div>
  );
}