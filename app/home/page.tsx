"use client"

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { singletonEventRole } from 'aws-cdk-lib/aws-events-targets';
import { signOut } from 'aws-amplify/auth';

function page() {
  const { user, route,signOut } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();

  useEffect(() => {
    if (route !== 'authenticated') {
      router.push('/sign-in'); // Redirigir a la página de inicio de sesión si no está autenticado
    }
  }, [route, router]);

  // Si el usuario no está autenticado, puedes mostrar una pantalla de carga o redireccionar
  if (route !== 'authenticated') {
    return <div>Loading...</div>;
  }

  const navigateToDashboard  = () => {
    router.push('/dashboard');
  }
  
 

  function isAdmin() {
    if(user?.signInDetails?.loginId === 'jonaherrera90@hotmail.com'){
      return <div>
        <button onClick={navigateToDashboard} className='button'>Dashbord</button>
      </div>
    }else{
      return <div>Estoy como usuario normal</div>
    }
  }

  return (
    <div>
      <h1>Este es el Home, {user?.signInDetails?.loginId}</h1>
      {isAdmin()}
    </div>
  );
}

export default page