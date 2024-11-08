"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const adminEmails = ["jonaherrera90@hotmail.com"];

export default function HomePage() {
  const { user, route,signOut } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();


  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const handleAdmin = () => {
    router.push('/dashboard');
  }

  useEffect(() => {
    if (route !== 'authenticated') {
      router.push('/sign-in');
    } else {
      router.push('/dashboard');
    }
  }, [route, router]);

  if (route !== 'authenticated') {
    return <div>Cargando...</div>;
  }


  function isAdmin() {
    if(user?.signInDetails?.loginId === 'jonaherrera90@hotmail.com'){
      return <div>
        <div>Cargando ...</div>
        {}
      </div>
    }else{
      return <div>Estoy como usuario normal</div>
    }
  }

  return (
    <div>
      <h1>Este es el Home, {user?.signInDetails?.loginId}</h1>
      <button onClick={handleSignOut} className='button'>Cerrar sesión</button>
      {isAdmin()}
    </div>
  );
}

