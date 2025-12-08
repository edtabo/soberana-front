import { Product } from '../types';
import { ProductRecord } from './ProductRecord';

interface ProductItemProps {
  product: Product;
  records: Array<{ counter: number; create_at: string; [key: string]: any }>;
}

export function ProductItem({ product, records }: ProductItemProps) {
  return (
    <div className="ml-6 mb-4">
      <div className="bg-gray-50 p-3 rounded-lg shadow">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">Código: {product.code}</p>
        <p className="text-sm text-gray-600">
          Unidades por paquete: {product.packaging_unit}
        </p>
      </div>
      <div className="mt-2">
        {records.map((record) => (
          <ProductRecord key={`${record.counter}-${record.create_at}`} record={record} />
        ))}
      </div>
    </div>
  );
}