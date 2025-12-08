'use client';

import { useState, useEffect } from 'react';
import { getProducts, getWarehouses } from '@/features/inventory/actions/actions';
import InventoryForm from '@/features/inventory/components/InventoryForm';

export default function InventoryPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [warehousesData, productsData] = await Promise.all([
        getWarehouses(),
        getProducts(),
      ]);
      setWarehouses(warehousesData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Inventario</h2>
        <p className="text-gray-500">Complete el formulario para registrar un nuevo item de inventario.</p>
      </div>
      
      <InventoryForm 
        warehouses={warehouses} 
        products={products}
        onSuccess={fetchData} 
      />
    </div>
  );
}