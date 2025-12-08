'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createInventory } from '@/features/inventory/actions/actions';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';
import { localizations } from '@/utils/localizations';

interface Warehouse {
  id: number;
  name: string;
  code: string;
  maxCount: number;
  canCountToday: boolean;
  nextCountNumber: number;
}

interface Product {
  id: string | number;
  name: string;
  packaging_unit?: number;
  packaging_unit_name?: string;
  type?: number;
  type_id?: number;
  [key: string]: unknown;
}

interface ProductQuantity {
  packaging: string;
  units: number;
}

interface InventoryFormClientProps {
  warehouses: Warehouse[];
  products: Product[];
  onSuccess?: () => Promise<void>;
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

export default function InventoryFormClient({ warehouses, products, onSuccess }: InventoryFormClientProps) {
  const [state, dispatch] = useActionState(createInventory, null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<number | null>(null);
  const [productQuantities, setProductQuantities] = useState<Record<string, ProductQuantity>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const today = new Date();
  const currentDay = today.getDate();
  const isInventoryDisabled = currentDay > Number(process.env.MAX_DAYS || 3);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const daysInMonth = 3;

  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      value: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      label: `${day} de ${new Date(currentYear, currentMonth - 1, 1).toLocaleString('es', { month: 'long' })}`
    };
  });

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.toast?.message || localizations.inventory.createSuccess);
      formRef.current?.reset();
      setProductQuantities({});
      setSelectedWarehouse(null);
      if (onSuccess) onSuccess();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const getNextCount = (warehouseId: number | null) => {
    if (!warehouseId) return 1;
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse?.nextCountNumber || 1;
  };

  const getCanCountToday = (warehouseId: number | null) => {
    if (!warehouseId) return false;
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.canCountToday : false;
  };

  const handleQuantityChange = (productId: string | number, value: string, packagingUnit: number) => {
    const packagingQty = parseFloat(value) || 0;
    const units = Math.round(packagingQty * packagingUnit * 100) / 100;

    setProductQuantities(prev => ({
      ...prev,
      [productId]: {
        packaging: value,
        units
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const productsData = Object.entries(productQuantities)
      .filter(([_, qty]) => qty.packaging && parseFloat(qty.packaging) > 0)
      .map(([productId, qty]) => ({
        productId: Number(productId),
        quantityInPackaging: parseFloat(qty.packaging),
        quantityInUnits: qty.units
      }));

    formData.append('products', JSON.stringify(productsData));
    
    dispatch(formData);
  };

  if (isInventoryDisabled) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 font-medium">
            11111
            El control de inventario no se puede realizar. Solo está disponible los primeros 3 días del mes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">{localizations.inventory.title}</h3>
      
      <div className="space-y-6">
        {/* Bodega */}
        <div>
          <label htmlFor="warehouseId" className="block text-sm font-medium mb-1 text-black">
            {localizations.inventory.warehouseId} *
          </label>
          <select
            id="warehouseId"
            name="warehouseId"
            required
            value={selectedWarehouse || ''}
            onChange={(e) => {
              const warehouseId = Number(e.target.value);
              setSelectedWarehouse(warehouseId);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">{localizations.inventory.selectWarehouse}</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        {/* Conteo */}
        <div>
          <label htmlFor="countId" className="block text-sm font-medium mb-1 text-black">
            {localizations.inventory.countId} *
          </label>
          <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
            {selectedWarehouse ? `Conteo ${getNextCount(selectedWarehouse)}` : 'Seleccione una bodega primero'}
          </div>
          <input
            type="hidden"
            id="countId"
            name="countId"
            value={selectedWarehouse ? getNextCount(selectedWarehouse) : 1}
          />
        </div>

        {/* Products List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Productos</h3>
          <div className="space-y-4">
            {products.map((product) => {
              const packagingUnit = product.packaging_unit || 1;
              const quantity = productQuantities[product.id] || { packaging: '', units: 0 };

              return (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-black">{product.name}</h4>
                      <p className="text-sm text-black">
                        {packagingUnit} {product.packaging_unit_name || 'unidades'} por empaque
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-black">
                          Cantidad (empaques)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={quantity.packaging}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value, packagingUnit)}
                          className="w-24 border rounded-md px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-black">
                          Total unidades
                        </label>
                        <div className="w-24 px-2 py-1 bg-gray-500 rounded-md">
                          {quantity.units}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fecha de corte */}
        <div>
          <label htmlFor="cutoffDate" className="block text-sm font-medium mb-1 text-black">
            {localizations.inventory.cutoffDate} *
          </label>
          <select
            id="cutoffDate"
            name="cutoffDate"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Seleccione una fecha</option>
            {dayOptions.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Solo se pueden seleccionar los primeros 3 días del mes</p>
        </div>
      </div>

      {selectedWarehouse && !getCanCountToday(selectedWarehouse) ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No se pueden realizar más conteos para esta bodega hoy. Intente nuevamente mañana.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <SubmitButton />
        </div>
      )}
    </form>
  );
}