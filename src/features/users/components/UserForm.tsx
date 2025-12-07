'use client';

import { useActionState, useEffect } from 'react';
import { createUser } from '@/features/users/actions/actions';
import { useFormStatus } from 'react-dom';
import { toast } from 'react-toastify';
import { localizations } from '@/utils/localizations';

interface Warehouse {
  id: string | number;
  name: string;
  status: boolean;
}

interface UserFormProps {
  warehouses: Warehouse[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Creando...' : 'Crear Usuario'}
    </button>
  );
}

export default function UserForm({ warehouses }: UserFormProps) {
  const [state, dispatch] = useActionState(createUser, null);

  useEffect(() => {
    if (state && !state.success && state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={dispatch} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.register.name}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.register.lastName}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.register.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.register.password}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.register.roleId}
          </label>
          <select
            id="roleId"
            name="roleId"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un rol</option>
            <option value="1">Administrador</option>
            <option value="2">Usuario</option>
          </select>
        </div>

        <div>
          <label htmlFor="warehouses" className="block text-sm font-medium text-gray-700 mb-1">
            {localizations.register.warehouses}
          </label>
           <select
            id="warehouses"
            name="warehouses"
            multiple
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          >
            {warehouses.map((w) => (
              <option key={w.id} value={w.id} disabled={!w.status} className={!w.status ? 'text-gray-400' : ''}>
                {w.status ? w.name : `${w.name} - Inactivo por remodelaciones`}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (o Cmd) para seleccionar varios</p>
        </div>
      </div>

      <div className="pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
