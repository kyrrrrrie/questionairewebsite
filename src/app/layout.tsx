'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });






export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  var token = ""
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || "";
  }

  return (
    <html lang="en">
      <body className={inter.className} style={{ background: 'white' }}>


        {children}


      </body>
    </html>
  );
}
