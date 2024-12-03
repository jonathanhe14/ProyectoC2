"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { AuthProvider } from "./components/AuthProvider";
import "./../app/globals.css";
import "@aws-amplify/ui-react/styles.css";
import { Provider } from "@/components/ui/provider"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>


       <Provider><AuthProvider>{children}</AuthProvider></Provider> 
      </body>
    </html>
  );
}
