// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CompleteRegister = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     username: '',
//     password: '',
//     reTypePassword: '',
//     role: '',
//     profileImage: null as File | null,
//   });

//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData((prevData) => ({
//         ...prevData,
//         profileImage: file,
//       }));
//     }
//   };

//   const completeRegistration = async () => {
//     setIsLoading(true);
//     const email = localStorage.getItem('userEmail');
//     if (!email) {
//       setMessage('Email not found in localStorage');
//       setIsLoading(false);
//       return;
//     }

//     const formDataToSend = new FormData();
//     formDataToSend.append('email', email);
//     formDataToSend.append('name', formData.name);
//     formDataToSend.append('username', formData.username);
//     formDataToSend.append('password', formData.password);
//     formDataToSend.append('reTypePassword', formData.reTypePassword);
//     formDataToSend.append('role', formData.role);

//     if (formData.profileImage) {
//       formDataToSend.append('profileImage', formData.profileImage);
//     }

//     try {
//       const response = await fetch(
//         'http://localhost:8000/api/v1/auth/fill-data',
//         {
//           method: 'POST',
//           body: formDataToSend,
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         setMessage(errorData.message || 'Something went wrong');
//         toast.error(errorData.message || 'Something went wrong');
//       } else {
//         const result = await response.json();
//         setMessage(result.message);
//         toast.success('Registration successful! Redirecting to login page...');

//         setTimeout(() => {
//           router.push('http://localhost:3000/auth/login');
//         }, 2000);
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         setMessage('An error occurred: ' + error.message);
//         toast.error('An error occurred: ' + error.message);
//       } else {
//         setMessage('An unknown error occurred');
//         toast.error('An unknown error occurred');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Complete Registration
//       </h2>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           completeRegistration();
//         }}
//         className="space-y-4"
//       >
//         <div>
//           <label
//             htmlFor="name"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Name:
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="username"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Username:
//           </label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleInputChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Password:
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="reTypePassword"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Retype Password:
//           </label>
//           <input
//             type="password"
//             id="reTypePassword"
//             name="reTypePassword"
//             value={formData.reTypePassword}
//             onChange={handleInputChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="role"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Role:
//           </label>
//           <select
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleInputChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select a role</option>
//             <option value="STOREADMIN">Store Admin</option>
//             <option value="CUSTOMERS">Customer</option>
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="profileImage"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Profile Image:
//           </label>
//           <input
//             type="file"
//             id="profileImage"
//             name="profileImage"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md disabled:bg-blue-400"
//         >
//           {isLoading ? 'Submitting...' : 'Complete Registration'}
//         </button>
//       </form>

//       {message && (
//         <div className="mt-4 text-center text-red-500">{message}</div>
//       )}
//     </div>
//   );
// };

// export default CompleteRegister;
