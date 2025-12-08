import { getInventory } from '../actions/actions';
import { UserInventoryUi } from './UserInventory';
import { UserInventory } from '../types';


export default async function InventoryFormAdmin() {
  const inventoryData = await getInventory();

  if (!inventoryData) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>No se pudo cargar el inventario</p>
      </div>
    );
  }

  if (inventoryData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No hay datos de inventario disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Panel de Administración de Inventario</h2>
        <p className="text-gray-500">Bienvenido al panel de administración de inventario.</p>
      </div>
      
      <div className="space-y-8">
        {inventoryData.map((user: UserInventory, index: number) => (
          <UserInventoryUi key={`${user.email}-${index}`} user={user} />
        ))}
      </div>
    </div>
  );
}