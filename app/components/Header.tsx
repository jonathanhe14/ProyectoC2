'use client'
// components/Header.tsx
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Header = () => {

const { user,signOut } = useAuthenticator((context) => [context.user, context.route]);
const router = useRouter();
  // Simulando un nombre de usuario
  const [username] = useState(user?.signInDetails?.loginId);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">

        <h1 className="text-2xl font-bold text-white">FitNation </h1>


        <nav className="flex items-center space-x-6">
        <Link href="/clases" className="text-white hover:text-gray-400 transition duration-300">
            Clases
          </Link>
          <Link href="/horarios" className="text-white hover:text-gray-400 transition duration-300">
            Horarios
          </Link>


          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300" onClick={handleSignOut}>
            Sign Out
          </button>


          <div className="flex items-center space-x-3">
            <img
              src="https://reqres.in/img/faces/1-image.jpg"
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-500"
            />
            <span className="text-white font-medium">{username}</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
