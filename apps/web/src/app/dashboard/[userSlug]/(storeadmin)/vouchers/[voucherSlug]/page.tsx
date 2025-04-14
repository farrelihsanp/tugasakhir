// 'use client';

// import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useParams, useRouter } from 'next/navigation';
// import { Voucher } from '@/types/types';
// import { Link } from 'react-router-dom';

// export default function CreateVoucherPage() {
//   const handleCreateVoucher = async () => {
//     setLoading(true);

//     try {
//       const response = await fetch(
//         'http://localhost:8000/api/v1/create-voucher',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             name: 'New Voucher',
//             description: 'A special discount!',
//             code: 'NEWVOUCHER',
//             voucherCategory: 'SHOPPING_RESULT',
//             voucherType: 'AMOUNT',
//             value: 5000,
//             startDate: '2025-05-01',
//             endDate: '2025-06-01',
//             stock: 100,
//             isActive: true,
//           }),
//           credentials: 'include',
//         },
//       );

//       const data = await response.json();
//       if (data.ok) {
//         toast.success('Voucher created successfully');
//         fetchVouchers();
//       } else {
//         toast.error('Failed to create voucher');
//       }
//     } catch (error: unknown) {
//       console.error('Error creating voucher:', error);
//       setError((error as Error).message);
//       toast.error((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return <div>CreateVoucherPage</div>;
// }
