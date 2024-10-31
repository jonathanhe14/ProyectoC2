import { Authenticator } from '@aws-amplify/ui-react';
import { ReactNode } from 'react';

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
