import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { StoreProvider } from '../utility/StoreContext';
import { SessionProvider } from 'next-auth/react';
import LayoutWrapper from '@/components/layout/layoutWrapper';

export const metadata: Metadata = {
  title: 'Quickmart',
  description: 'Best Online Grocery in the World!',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <SessionProvider>
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
            />
            <LayoutWrapper>{children}</LayoutWrapper>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
