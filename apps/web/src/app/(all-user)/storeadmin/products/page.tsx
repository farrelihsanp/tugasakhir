// pages/admin/products.tsx
import Head from 'next/head';
import Navbar from '../../../../components/common/navbar';
import Footer from '../../../../components/common/footer';
import ProductManagement from '../../../../components/dashboard/product-management';

const ProductManagementPage = () => {
  return (
    <>
      <Head>
        <title>Product Management - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <ProductManagement />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductManagementPage;
