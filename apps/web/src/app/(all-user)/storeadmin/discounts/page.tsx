// pages/admin/discounts.tsx
import Head from 'next/head';
import Navbar from '../../../../components/common/navbar';
import Footer from '../../../../components/common/footer';
import DiscountManagement from '../../../../components/dashboard/discount-management';

const DiscountManagementPage = () => {
  return (
    <>
      <Head>
        <title>Discount Management - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <DiscountManagement />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DiscountManagementPage;
