"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { AuthProvider } from "./components/AuthProvider";
import "./../app/globals.css";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        {children}
        </AuthProvider>
        </body>
    </html>
  );
}
