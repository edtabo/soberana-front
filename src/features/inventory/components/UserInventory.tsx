import { UserInventory } from '../types';
import { WarehouseSection } from './WarehouseSection';

interface UserInventoryProps {
  user: UserInventory;
}

export function UserInventoryUi({ user }: UserInventoryProps) {
  return (
    <div className="mb-8 p-4 border rounded-lg">
      <div className="mb-4 pb-2 border-b">
        <h1 className="text-2xl font-bold">
          {user.name} {user.last_name}
        </h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div>
        {user.warehousesuser.map((warehouseUser, index) => (
          <WarehouseSection
            key={warehouseUser.warehouse.code || index}
            warehouse={warehouseUser.warehouse}
          />
        ))}
      </div>
    </div>
  );
}