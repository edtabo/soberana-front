'use client';

import { useFormStatus } from 'react-dom';
import { localizations } from '@/utils/localizations';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gray-900 text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Cargando...' : localizations.login.submit}
    </button>
  );
}
