'use client';

import Image from 'next/image';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { actionLogin } from '@/features/login/actions/actions';
import { localizations } from '@/utils/localizations';
import { SubmitButton } from './SubmitButton';
import { useToast } from '@/hooks/useToast';
import { redirect } from 'next/navigation';

const initialState: any = {
  success: false,
  error: '',
  fieldErrors: {},
};

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [state, formAction] = useFormState(actionLogin, initialState);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (state?.toast) {
      const { type, message } = state.toast;
      const toastFn = toast[type as keyof typeof toast];
      if (toastFn) {
        toastFn(message);
      }
      if (state?.success) {
        redirect('/dashboard');
      }
    }
  }, [state, toast]);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 border-2 border-gray-600/10 rotate-12 rounded-3xl"></div>
        <div className="absolute top-32 left-32 w-64 h-64 border-2 border-gray-600/10 rotate-12 rounded-3xl"></div>
        <div className="absolute top-44 left-44 w-64 h-64 border-2 border-gray-600/10 rotate-12 rounded-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-center w-full">
          <Image
            src="https://www.soberana.com.co/wp-content/themes/lasoberana/images/logo-la-soberana.svg"
            alt="Soberana"
            width={200}
            height={72}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 align-center">
            <Image
              src="https://www.soberana.com.co/wp-content/themes/lasoberana/images/logo-la-soberana.svg"
              alt="Soberana"
              width={200}
              height={72}
              className="mx-auto"
            />
          </div>

          <div className="space-y-8">
            <form action={formAction} className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={localizations.login.email}
                  className={`w-full px-0 py-3 border-0 border-b-2 ${
                    state?.fieldErrors?.email 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-300 focus:border-gray-900'
                  } focus:outline-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-500 transition-colors`}
                />
                {state?.fieldErrors?.email && (
                  <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={localizations.login.password}
                  className={`w-full px-0 py-3 border-0 border-b-2 ${
                    state?.fieldErrors?.password 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-300 focus:border-gray-900'
                  } focus:outline-none focus:ring-0 bg-transparent text-gray-900 placeholder-gray-500 transition-colors`}
                />
                {state?.fieldErrors?.password && (
                  <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password}</p>
                )}
              </div>
              
              <SubmitButton />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}