'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, route } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();

  useEffect(() => {
    if (route !== 'authenticated') {
      router.push('/sign-in');
    }
  }, [route, router]);

  if (route !== 'authenticated') {
    return <div>Loading...</div>; // O una pantalla de carga personalizada
  }

  return (
    <div>
      <h1>Bienvenido, {user?.userId}</h1>
    </div>
  );
}