"use client"; // Esto asegura que se renderice solo en el cliente

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Authenticator,
  translations,
  useAuthenticator,
  View,
  Heading,
  Text,
  Button,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import {
  ThemeProvider,
  useTheme,
  Theme,
  defaultDarkModeOverride,
  ColorMode,
} from "@aws-amplify/ui-react";
import { I18n } from "aws-amplify/utils";
import Image from "next/image";
I18n.putVocabularies(translations);
I18n.setLanguage("es");

Amplify.configure(outputs);

export default function SignInPage() {
  const router = useRouter();
  const { route, user } = useAuthenticator((context) => [
    context.route,
    context.user,
  ]);

  useEffect(() => {
    if (
      route === "authenticated" &&
      user?.signInDetails?.loginId === "jonaherrera90@hotmail.com"
    ) {
      router.push("/dashboard");
    } else if (route === "authenticated") {
      router.push("/home");
    }
  }, [route, router]);

  const { tokens } = useTheme();
  const theme: Theme = {
    name: "Auth Example Theme",
    overrides: [defaultDarkModeOverride],
  };

  const components = {
    Header() {
      const { tokens } = useTheme();

      return (
        <View textAlign="center" padding={tokens.space.large} className="justify-center">

            
            <h1 className="text-6xl font-bold text-black">FitNation</h1>

        </View>
      );
    },

    Footer() {
      const { tokens } = useTheme();

      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; All Rights Reserved
          </Text>
        </View>
      );
    },

    SignIn: {
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Iniciar Sesión
          </Heading>
        );
      },
      Footer() {
        const { toForgotPassword } = useAuthenticator();

        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toForgotPassword}
              size="small"
              variation="link"
            >
              Recuperar Contraseña
            </Button>
          </View>
        );
      },
    },

    SignUp: {
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Crea una cuenta
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();

        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toSignIn}
              size="small"
              variation="link"
            >
              Volver a Iniciar Sesión
            </Button>
          </View>
        );
      },
    },
    ConfirmSignUp: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Ingresa tu información:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    SetupTotp: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Ingresa tu información:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ConfirmSignIn: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Ingresa tu información:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ForgotPassword: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Ingresa tu información:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ConfirmResetPassword: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Ingresa tu información:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
  };

  return (
    <>
      <ThemeProvider theme={theme} colorMode="light">
        <Authenticator components={components}>
          {({ signOut, user }) => (
            <div>
              {/* <h1>Bienvenido, {user?.signInDetails?.loginId}</h1>
          <button onClick={signOut}>Sign Out</button> */}
            </div>
          )}
        </Authenticator>
      </ThemeProvider>
    </>
  );
}
