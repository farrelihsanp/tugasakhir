// pages/admin/inventory.tsx
import Head from 'next/head';
import Navbar from '../../../../components/common/navbar';
import Footer from '../../../../components/common/footer';
import InventoryManagement from '../../../../components/dashboard/inventory-management';

const InventoryManagementPage = () => {
  return (
    <>
      <Head>
        <title>Inventory Management - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <InventoryManagement />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default InventoryManagementPage;
