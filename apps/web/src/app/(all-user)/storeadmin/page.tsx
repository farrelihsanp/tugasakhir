// pages/admin/dashboard.tsx
import Head from 'next/head';
import Navbar from '../../../components/common/navbar';
import Footer from '../../../components/common/footer';
import AdminDashboard from '../../../components/dashboard/admin-dashboard';

const AdminDashboardPage = () => {
  return (
    <>
      <Head>
        <title>Admin Dashboard - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6 min-h-screen">
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboardPage;
