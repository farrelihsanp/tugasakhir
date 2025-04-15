export default function VoucherPage() {
  return <div>VoucherPage</div>;
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useParams, useRouter } from 'next/navigation';
// import { Voucher } from '@/types/types';
// import Link from 'next/link';
// // sampesini
// const VoucherPage = () => {
//   const [vouchers, setVouchers] = useState<Voucher[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const router = useRouter();
//   const { id } = useParams();

//   // Fetch all vouchers (for store admin)
//   const fetchVouchers = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         'http://localhost:8000/api/v1/all-vouchers',
//         {
//           method: 'GET',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );
//       const data = await response.json();
//       if (data.ok) {
//         setVouchers(data.data);
//       } else {
//         toast.error('Failed to fetch vouchers');
//       }
//     } catch (error: unknown) {
//       console.error('Error fetching vouchers:', error);
//       toast.error('Error fetching vouchers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVouchers();
//   }, []);

//   const handleUpdateVoucher = async (voucherId: number) => {
//     router.push(`/dashboard/${id}/(storeadmin)/vouchers/${voucherId}/update`);
//   };

//   const handleDeleteVoucher = async (voucherId: number) => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/v1/delete-voucher/${voucherId}`,
//         {
//           method: 'DELETE',
//           credentials: 'include',
//         },
//       );

//       const data = await response.json();
//       if (data.ok) {
//         toast.success('Voucher deleted successfully');
//         fetchVouchers(); // Reload vouchers
//       } else {
//         toast.error('Failed to delete voucher');
//       }
//     } catch (error: unknown) {
//       setError((error as Error).message);
//       toast.error((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGetVoucherById = async () => {
//     if (!id) return; // Ensure ID is available before fetching
//     setLoading(true);

//     try {
//       const response = await fetch(`/api/v1/my-voucher/${id}`, {
//         credentials: 'include',
//       });
//       const data = await response.json();
//       if (data.ok) {
//         toast.success('Voucher fetched successfully');
//         router.push(`/voucher/${id}`); // Redirect to detail page
//       } else {
//         toast.error('Voucher not found');
//       }
//     } catch (error: unknown) {
//       setError((error as Error).message);
//       toast.error((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <div className="container max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-xl border border-gray-200">
//         <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
//           Vouchers
//         </h2>
//         {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

//         <div className="mb-6">
//           <Link
//             href="/dashboard/[userSlug]/(storeadmin)/vouchers/new"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//           >
//             Create New Voucher
//           </Link>
//         </div>

//         <div className="space-y-4">
//           {vouchers.map((voucher) => (
//             <div
//               key={voucher.id}
//               className="flex justify-between items-center p-4 bg-gray-100 rounded-lg"
//             >
//               <div>
//                 <h3 className="font-medium text-gray-800">{voucher.name}</h3>
//                 <p className="text-gray-600">{voucher.description}</p>
//               </div>
//               <div className="flex space-x-4">
//                 <div>
//                   <button
//                     onClick={() => handleUpdateVoucher(voucher.id)}
//                     className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
//                     disabled={loading}
//                   >
//                     {loading ? 'Updating...' : 'Update'}
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteVoucher(voucher.id)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
//                   disabled={loading}
//                 >
//                   {loading ? 'Deleting...' : 'Delete'}
//                 </button>
//                 <button
//                   onClick={handleGetVoucherById}
//                   className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-300"
//                   disabled={loading}
//                 >
//                   {loading ? 'Fetching...' : 'Get Details'}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default VoucherPage;
