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

export async function getCounts() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = await apiFetch({
      url: URLS.counts,
      method: RequestMethods.GET,
      headers,
    });

    if (!req.success) {
      console.error('Error fetching counts:', req.message);
      return [];
    }

    return req.data || [];
  } catch (error) {
    console.error('Error fetching counts:', error);
    return [];
  }
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
      url: URLS.warehouses,
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
  const body = {
    countId: formData.get('countId'),
    cutoffDate: formData.get('cutoffDate'),
    warehouseId: formData.get('warehouseId'),
    productId: formData.get('productId'),
    quantityInPackaging: formData.get('quantityInPackaging'),
  };

  try {
    const validatedData = inventorySchema.parse(body);

    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = {
      count_id: Number(validatedData.countId),
      cutoff_date: validatedData.cutoffDate,
      warehouse_id: Number(validatedData.warehouseId),
      product_id: Number(validatedData.productId),
      quantity_in_packaging: Number(validatedData.quantityInPackaging),
    };

    console.log("Sending Inventory Payload:", payload);

    const req = await apiFetch({
      url: URLS.inventory,
      method: RequestMethods.POST,
      headers,
      body: payload,
    });

    if (!req.success)
      return createErrorToast(req.message || localizations.inventory.createError, {
        success: false,
        error: req.message || localizations.inventory.createError,
      });

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues[0]?.message || localizations.inventory.createError;
      return createErrorToast(errorMessage, { success: false, error: errorMessage });
    }
    const errorMessage = error instanceof Error ? error.message : localizations.inventory.createError;
    return createErrorToast(errorMessage, { success: false, error: errorMessage });
  }

  redirect('/dashboard/inventory?success=true');
}

