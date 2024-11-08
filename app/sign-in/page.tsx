'use client'; // Esto asegura que se renderice solo en el cliente

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";

export default function SignInPage() {
  const router = useRouter();
  const { route, user } = useAuthenticator((context) => [context.route, context.user]);

  // Use useEffect to handle redirection after successful authentication
  useEffect(() => {
    if (route === 'authenticated' && user?.signInDetails?.loginId === 'jonaherrera90@hotmail.com') {
      // Redirect to /home when the user is authenticated
      router.push('/dashboard');
    }else if(route === 'authenticated'){
      router.push('/home');
    } 
  }, [route, router]);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          {/* <h1>Bienvenido, {user?.signInDetails?.loginId}</h1>
          <button onClick={signOut}>Sign Out</button> */}
        </div>
      )}
    </Authenticator>
  );
}

