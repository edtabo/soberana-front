'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '@/utils/fetch';
import { RequestMethods } from '@/utils/enums';
import { localizations } from '@/utils/localizations';
import { loginSchema } from '../schemas/loginSchema';
import { ZodError } from 'zod';
import { URLS } from '@/utils/urls';
import { createErrorToast, createSuccessToast } from '@/utils/toastUtils';

export async function actionLogin(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const validatedData = loginSchema.parse({ email, password });

    if (!validatedData)
      return createErrorToast(localizations.error.login, {
        success: false,
        error: localizations.error.login,
      });

    const req = await apiFetch({
      url: URLS.auth,
      method: RequestMethods.POST,
      body: {
        ...validatedData
      },
    });
    if (!req.success || !req.data || req.data === null || req.data === "") {
      return createErrorToast(req.message, {
        success: false,
        error: req.message,
      });
    }


    const cookieStore = await cookies();

    cookieStore.set({
      name: 'access_token',
      value: req.data,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 min
      path: '/',
    });

    return createSuccessToast(localizations.success.login, {
      success: true,
      error: '',
    });
  } catch (error) {

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });

      return createErrorToast(localizations.error.login, {
        success: false,
        fieldErrors,
        error: localizations.error.login,
      });
    }

    return createErrorToast(localizations.error.login, {
      success: false,
      error: localizations.error.login,
    });
  }
}

import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  redirect('/');
}
