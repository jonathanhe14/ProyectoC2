import { Authenticator } from '@aws-amplify/ui-react';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FitNation',
  description:
    'FitNation es una aplicación de fitness que te permite encontrar clases de entrenamiento',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
};
