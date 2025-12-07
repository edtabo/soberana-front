'use client';

import { useActionState, useEffect, useState } from 'react';
import { createInventory } from '@/features/inventory/actions/actions';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';
import { localizations } from '@/utils/localizations';

interface Warehouse {
  id: string | number;
  name: string;
  status: boolean;
}

interface Count {
  id: string | number;
  name?: string;
  code?: string;
  [key: string]: unknown;
}

interface Product {
  id: string | number;
  name: string;
  packaging_unit?: number;
  packaging_unit_name?: string;
  [key: string]: unknown;
}

interface InventoryFormProps {
  warehouses: Warehouse[];
  counts: Count[];
  products: Product[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? localizations.inventory.creating : localizations.inventory.createButton}
    </button>
  );
}

export default function InventoryForm({ warehouses, counts, products }: InventoryFormProps) {
  const [state, dispatch] = useActionState(createInventory, null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityInPackaging, setQuantityInPackaging] = useState<string>('');
  const [quantityInUnits, setQuantityInUnits] = useState<number>(0);

  useEffect(() => {
    if (state && !state.success && state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleProductChange = (productId: string) => {
    const product = products.find(p => String(p.id) === productId);
    setSelectedProduct(product || null);
    // Reset quantities when product changes
    setQuantityInPackaging('');
    setQuantityInUnits(0);
  };

  const handleQuantityChange = (value: string) => {
    setQuantityInPackaging(value);
    
    if (selectedProduct && selectedProduct.packaging_unit && value) {
      const packagingUnit = selectedProduct.packaging_unit;
      const quantity = parseFloat(value);
      if (!isNaN(quantity) && quantity >= 0) {
        const units = quantity * packagingUnit;
        setQuantityInUnits(Math.round(units * 100) / 100); // Round to 2 decimal places
      } else {
        setQuantityInUnits(0);
      }
    } else {
      setQuantityInUnits(0);
    }
  };

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{localizations.inventory.title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="countId" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.inventory.countId} *
          </label>
          <select
            id="countId"
            name="countId"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">{localizations.inventory.selectCount}</option>
            {counts.map((count) => (
              <option key={count.id} value={count.id}>
                {count.name || count.code || `Conteo ${count.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cutoffDate" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.inventory.cutoffDate} *
          </label>
          <input
            type="date"
            id="cutoffDate"
            name="cutoffDate"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-1">
          {localizations.inventory.warehouseId} *
        </label>
        <select
          id="warehouseId"
          name="warehouseId"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">{localizations.inventory.selectWarehouse}</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id} disabled={!warehouse.status}>
              {warehouse.status ? warehouse.name : `${warehouse.name} - Inactivo`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
          {localizations.inventory.productId} *
        </label>
        <select
          id="productId"
          name="productId"
          required
          onChange={(e) => handleProductChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">{localizations.inventory.selectProduct}</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} {product.packaging_unit_name ? `(${product.packaging_unit_name})` : ''}
            </option>
          ))}
        </select>
        {selectedProduct && selectedProduct.packaging_unit && (
          <p className="text-xs text-gray-500 mt-1">
            Unidad de empaque: {selectedProduct.packaging_unit} {selectedProduct.packaging_unit_name || 'unidades'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="quantityInPackaging" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.inventory.quantityInPackaging} *
          </label>
          <input
            type="number"
            id="quantityInPackaging"
            name="quantityInPackaging"
            required
            min="0"
            step="0.01"
            value={quantityInPackaging}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="quantityInUnits" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.inventory.quantityInUnits}
          </label>
          <input
            type="number"
            id="quantityInUnits"
            name="quantityInUnits"
            readOnly
            value={quantityInUnits}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">Calculado automáticamente</p>
        </div>
      </div>

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}

