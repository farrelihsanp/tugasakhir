'use client';

import Head from 'next/head';
import Navbar from '../../../../components/common/navbar';
import Footer from '../../../../components/common/footer';
import ReportAnalysis from '../../../../components/dashboard/report-analysis';

const ReportAnalysisPage = () => {
  return (
    <>
      <Head>
        <title>Report & Analysis - Grocery Store</title>
      </Head>
      <Navbar />
      <main className="py-12">
        <div className="container mx-auto px-6">
          <ReportAnalysis />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ReportAnalysisPage;
