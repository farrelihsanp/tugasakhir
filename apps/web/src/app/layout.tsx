import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { StoreProvider } from '../utility/StoreContext';
import { Geolocation } from '../components/location-request';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quickmart',
  description: 'Best Online Grocery in the World!',
};

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
          <Navbar />
          <Geolocation />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
          />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
