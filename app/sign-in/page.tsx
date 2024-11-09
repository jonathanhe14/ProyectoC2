'use client'; // Esto asegura que se renderice solo en el cliente

import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { Authenticator, translations, useAuthenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { ThemeProvider, useTheme, Theme, defaultDarkModeOverride, ColorMode } from '@aws-amplify/ui-react';
import { I18n } from 'aws-amplify/utils';
I18n.putVocabularies(translations)
I18n.setLanguage('es');

Amplify.configure(outputs);

export default function SignInPage() {
  const router = useRouter();
  const { route, user } = useAuthenticator((context) => [context.route, context.user]);
  const [colorMode, setColorMode] = useState<ColorMode>('dark');
  // Use useEffect to handle redirection after successful authentication
  useEffect(() => {
    if (route === 'authenticated' && user?.signInDetails?.loginId === 'jonaherrera90@hotmail.com') {
      // Redirect to /home when the user is authenticated
      router.push('/dashboard');
    }else if(route === 'authenticated'){
      router.push('/home');
    } 
  }, [route, router]);

  const { tokens } = useTheme();
  const theme: Theme = {
    name: 'Auth Example Theme',
    overrides: [defaultDarkModeOverride],
  };


  return (
<ThemeProvider theme={theme} colorMode={colorMode}>
    <Authenticator >
      {({ signOut, user }) => (
        <div>
          {/* <h1>Bienvenido, {user?.signInDetails?.loginId}</h1>
          <button onClick={signOut}>Sign Out</button> */}
        </div>
      )}
    </Authenticator>
</ThemeProvider>

  );
}

