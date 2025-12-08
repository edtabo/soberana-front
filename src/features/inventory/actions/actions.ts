'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '@/utils/fetch';
import { RequestMethods } from '@/utils/enums';
import { URLS } from '@/utils/urls';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { createErrorToast, ToastType } from '@/utils/toastUtils';
import { localizations } from '@/utils/localizations';
import { inventorySchema } from '../schemas/inventorySchema';

export interface InventoryActionState {
  success?: boolean;
  error?: string;
  toast?: {
    type: ToastType;
    message: string;
  };
  [key: string]: unknown;
}

export async function getProducts() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = await apiFetch({
      url: URLS.products,
      method: RequestMethods.GET,
      headers,
    });

    if (!req.success) {
      console.error('Error fetching products:', req.message);
      return [];
    }

    return req.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getWarehouses() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = await apiFetch({
      url: URLS.warehouseUser,
      method: RequestMethods.GET,
      headers,
    });

    return req.data || [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return [];
  }
}

export async function createInventory(prevState: InventoryActionState | null, formData: FormData): Promise<InventoryActionState> {
  const warehouseId = formData.get('warehouseId');
  const cutoffDate = formData.get('cutoffDate');
  
  const products = JSON.parse(formData.get('products') as string) || [];

  const body = {
    warehouseId,
    cutoffDate,
    products: products.map((p: any) => ({
      productId: p.productId,
      quantityInPackaging: p.quantityInPackaging,
      quantityInUnits: p.quantityInUnits
    }))
  };

  try {
    const validatedData = inventorySchema.parse(body);
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = {
      warehouse_id: Number(validatedData.warehouseId),
      cutoff_date: validatedData.cutoffDate,
      products: validatedData.products.map(p => ({
        product_id: p.productId,
        quantity_in_packaging_units: p.quantityInPackaging,
        quantity_in_units: p.quantityInUnits
      }))
    };


    console.log(" +++++++++++++++++++ ")
    console.log(payload)
    console.log(" +++++++++++++++++++ ")

    const req = await apiFetch({
      url: URLS.inventory,
      method: RequestMethods.POST,
      headers,
      body: payload
    });

    if (!req.success) {
      return createErrorToast(req.message || localizations.inventory.createError, {
        success: false,
        error: req.message || localizations.inventory.createError,
      });
    }

    return {
      success: true,
      message: localizations.inventory.createSuccess,
    };

  } catch (error: unknown) {
    console.error("Error creating inventory:", error);
    
    if (error instanceof ZodError) {
      const errorMessage = error.issues[0]?.message || localizations.inventory.createError;
      return createErrorToast(errorMessage, { success: false, error: errorMessage });
    }
    
    return createErrorToast(localizations.inventory.createError, { 
      success: false, 
      error: error instanceof Error ? error.message : localizations.inventory.createError 
    });
  }
}

