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
  const { user, route } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();

  // Si no está autenticado, redirige al usuario a la página de inicio de sesión
  useEffect(() => {
    if (route !== 'authenticated') {
      router.push('/sign-in');
    } else {
      router.push('/home');
    }
  }, [route, router]);

  if (route !== 'authenticated') {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      Pagina Principal
    </div>
  );
}

