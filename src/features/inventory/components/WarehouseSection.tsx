import { Warehouse } from '../types';
import { ProductItem } from './ProductItem';

interface WarehouseSectionProps {
  warehouse: Warehouse;
}

export function WarehouseSection({ warehouse }: WarehouseSectionProps) {
  const productsMap = warehouse.records.reduce((acc, record) => {
    const productCode = record.product.code;
    if (!acc[productCode]) {
      acc[productCode] = {
        product: record.product,
        records: [],
      };
    }
    acc[productCode].records.push(record);
    return acc;
  }, {} as Record<string, { product: any; records: any[] }>);

  return (
    <div className="mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold">{warehouse.name}</h2>
        <p className="text-sm text-gray-600">Código: {warehouse.code}</p>
      </div>
      <div className="mt-2">
        {Object.values(productsMap).map(({ product, records }) => (
          <ProductItem
            key={product.code}
            product={product}
            records={records}
          />
        ))}
      </div>
    </div>
  );
}