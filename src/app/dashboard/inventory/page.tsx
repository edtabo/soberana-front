import { getCounts, getProducts, getWarehouses } from '@/features/inventory/actions/actions';
import InventoryForm from '@/features/inventory/components/InventoryForm';

export default async function InventoryPage() {
  const [warehouses, counts, products] = await Promise.all([
    getWarehouses(),
    getCounts(),
    getProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Inventario</h2>
        <p className="text-gray-500">Complete el formulario para registrar un nuevo item de inventario.</p>
      </div>
      
      <InventoryForm 
        warehouses={warehouses || []} 
        counts={counts || []} 
        products={products || []} 
      />
    </div>
  );
}
