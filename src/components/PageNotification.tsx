'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function PageNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Usuario creado correctamente');
      router.replace('/dashboard/users');
    } else if (searchParams.get('updated') === 'true') {
      toast.success('Usuario actualizado correctamente');
      router.replace('/dashboard/users');
    }
  }, [searchParams, router]);

  return null;
}
