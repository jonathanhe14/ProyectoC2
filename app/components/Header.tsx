"use client";
// components/Header.tsx
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@aws-amplify/ui-react";

const Header = () => {
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.route,
  ]);

  const router = useRouter();
  // Simulando un nombre de usuario
  const [username] = useState(user?.signInDetails?.loginId);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handleClick =()=>{
    router.push("/home")
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black" onClick={handleClick}>FitNation </h1>

        <nav className="flex items-center space-x-6">
          {user?.signInDetails?.loginId === "jonaherrera90@hotmail.com" ? (
            <Link
              href="/dashboard"
              className="text-black hover:text-gray-400 transition duration-300"
            >
              Clases
            </Link>
          ) : <Link
          href="/myclasses"
          className="text-black hover:text-gray-400 transition duration-300"
        >
          Mis clases
        </Link>}

          <Button variation="link" colorTheme="error" onClick={handleSignOut}>
          Sign Out
          </Button>

          <div className="flex items-center space-x-3">
            <img
              src="https://reqres.in/img/faces/1-image.jpg"
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-500"
            />
            <span className="text-black font-medium">
              {username === "jonaherrera90@hotmail.com" ? "Admin" : username}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
