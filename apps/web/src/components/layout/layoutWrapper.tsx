'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import { Geolocation } from '../location-request';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  const hideLayout = ['/auth/login', '/auth/register'];
  const shouldHideLayout = hideLayout.includes(pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {!shouldHideLayout && <Geolocation />}
      <main className={shouldHideLayout ? '' : 'px-20'}>{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
}
