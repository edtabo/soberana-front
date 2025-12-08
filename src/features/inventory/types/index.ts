export interface Product {
  name: string;
  code: string;
  packaging_unit: number;
}

export interface Record {
  counter: number;
  quantity_in_packaging_units: number;
  quantity_in_units: number;
  create_at: string;
  product: Product;
}

export interface Warehouse {
  name: string;
  code: string;
  records: Record[];
}

export interface WarehouseUser {
  warehouse: Warehouse;
}

export interface UserInventory {
  name: string;
  last_name: string;
  email: string;
  warehousesuser: WarehouseUser[];
}

export interface InventoryResponse {
  success: boolean;
  data: UserInventory[];
}