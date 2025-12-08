'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '@/utils/fetch';
import { RequestMethods } from '@/utils/enums';
import { URLS } from '@/utils/urls';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { createErrorToast, ToastType } from '@/utils/toastUtils';
import { localizations } from '@/utils/localizations';

import { userSchema } from '../schemas/userSchema';

export async function getUsers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = await apiFetch({
      url: URLS.users,
      method: RequestMethods.GET,
      headers,
    });

    if (!req.success)
      return createErrorToast(req.message || localizations.error.request, {
        success: false,
        error: req.message || localizations.error.request,
      });

    return req.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return createErrorToast(localizations.error.request, {
      success: false,
      error: localizations.error.request,
    });
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

    console.log('. +++++++++++++++++++ ');
    console.log(req);
    console.log('. +++++++++++++++++++ ');

    // if (!req.success)
    //   createErrorToast(req.message || localizations.error.request, {
    //     success: false,
    //     error: req.message || localizations.error.request,
    //   });
    return req.data;
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return createErrorToast(localizations.error.request, {
      success: false,
      error: localizations.error.request,
    });
  }
}

export interface UserActionState {
  success?: boolean;
  error?: string;
  toast?: {
    type: ToastType;
    message: string;
  };
  [key: string]: any; // Allow other properties just in case
}

export async function createUser(prevState: any, formData: FormData): Promise<UserActionState> {
  const body = {
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    password: formData.get('password'),
    roleId: formData.get('roleId'),
    warehouses: formData.getAll('warehouses'),
  };

  try {
    const validatedData = userSchema.parse(body);

    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload = {
      name: validatedData.firstName,
      last_name: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
      role: Number(validatedData.roleId),
      warehouses: validatedData.warehouses.map(id => Number(id)),
    };

    console.log("Sending Payload:", payload);

    const req = await apiFetch({
      url: URLS.users,
      method: RequestMethods.POST,
      headers,
      body: payload,
    });

    if (!req.success)
      return createErrorToast(req.message || localizations.error.createUser, {
        success: false,
        error: req.message || localizations.error.createUser,
      });

  } catch (error: any) {
    if (error instanceof ZodError) {
      return createErrorToast(localizations.error.createUser, { success: false, error: localizations.error.createUser });
    }
    const errorMessage = error?.message || localizations.error.createUser;
    return createErrorToast(errorMessage, { success: false, error: errorMessage });
  }


  redirect('/dashboard/users?success=true');
}

export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: number;
  warehousesuser: { warehouse_id: number; }[];
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = await apiFetch({
      url: `${URLS.users}/${id}`,
      method: RequestMethods.GET,
      headers,
    });

    if (!req.success) {
      console.error('Error fetching user:', req.message);
      return null;
    }

    return req.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return { success: false, error: 'No autenticado' };
    }

    const response = await apiFetch({
      url: `${URLS.users}/${id}`,
      method: RequestMethods.DELETE,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.success) {
      return { success: false, error: response.message || 'Error al eliminar el usuario' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Error al procesar la solicitud' };
  }
}

export async function updateUser(id: string, prevState: any, formData: FormData): Promise<UserActionState> {
  const body = {
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    roleId: formData.get('roleId'),
    warehouses: formData.getAll('warehouses'),
  };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const payload: any = {
      name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      role: Number(body.roleId),
      warehouses: body.warehouses.map(id => Number(id)),
    };

    const password = formData.get('password');
    if (password) {
      payload.password = password;
    }

    console.log("Sending Update Payload:", payload);

    const req = await apiFetch({
      url: `${URLS.users}/${id}`,
      method: RequestMethods.PATCH,
      headers,
      body: payload,
    });

    if (!req.success)
      return createErrorToast(req.message || localizations.error.createUser, {
        success: false,
        error: req.message || localizations.error.createUser,
      });

  } catch (error: any) {
    const errorMessage = error?.message || localizations.error.createUser;
    return createErrorToast(errorMessage, { success: false, error: errorMessage });
  }

  redirect('/dashboard/users?updated=true');
}
