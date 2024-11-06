"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import "./../app/globals.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { AppProps } from "next/app";
import { fetchUserAttributes } from "aws-amplify/auth";
import { getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";


Amplify.configure(outputs);

const client = generateClient<Schema>();

const adminEmails = ["jonaherrera90@hotmail.com"];

export default function App({ Component, pageProps }: AppProps) {
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  // const { user } = useAuthenticator((context) => [context.user]);

  // useEffect(() => {
  //   async function userInfo() {
  //     try {
  //       const user = await fetchUserAttributes();

  //       if (user.email && adminEmails.includes(user.email)) {
  //         return router.push("/home");
  //       } else {
  //         return router.push("user");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user attributes:", error);
  //       return false;
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   if (user) {
  //     userInfo(); // Solo verificamos el rol si el usuario está autenticado
  //   }
  // }, [user, router]);

  // if (isLoading) {
  //   return <div>Cargando...</div>;
  // }
  const { user, route } = useAuthenticator((context) => [context.user, context.route]);
  const router = useRouter();

  // Si no está autenticado, redirige al usuario a la página de inicio de sesión
  useEffect(() => {
    console.log(route);
    if (route !== 'authenticated') {
      console.log(user?.signInDetails?.loginId);
      router.push('/sign-in');
    }else(
      router.push('/home')
    )
  }, [route, router]);

  if (route !== 'authenticated') {
    return <div>Cargando...</div>;
  }

  return (
    <div>
    </div>
  );
}
