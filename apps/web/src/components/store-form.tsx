// import React, { useState } from 'react';

// interface StoreFormProps {
//   onSubmit: (storeData: any) => void;
//   initialData?: any;
// }

// const StoreForm: React.FC<StoreFormProps> = ({ onSubmit, initialData }) => {
//   const [name, setName] = useState(initialData?.name || '');
//   const [address, setAddress] = useState(initialData?.address || '');
//   const [city, setCity] = useState(initialData?.city || '');
//   const [province, setProvince] = useState(initialData?.province || '');
//   const [country, setCountry] = useState(initialData?.country || '');
//   const [postalCode, setPostalCode] = useState(initialData?.postalCode || '');
//   const [phoneNumber, setPhoneNumber] = useState(
//     initialData?.phoneNumber || '',
//   );
//   const [latitude, setLatitude] = useState(initialData?.latitude || '');
//   const [longitude, setLongitude] = useState(initialData?.longitude || '');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     const storeData = {
//       name,
//       address,
//       city,
//       province,
//       country,
//       postalCode,
//       phoneNumber,
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//     };

//     try {
//       const response = await fetch('http://localhost:8000/api/v1/stores', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(storeData),
//         credentials: 'include',
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage(data.message);
//         onSubmit(storeData);
//         setName('');
//         setAddress('');
//         setCity('');
//         setProvince('');
//         setCountry('');
//         setPostalCode('');
//         setPhoneNumber('');
//         setLatitude('');
//         setLongitude('');
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError('An unexpected error occurred. Please try again later.');
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
//     >
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           {error}
//         </div>
//       )}
//       {successMessage && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
//           {successMessage}
//         </div>
//       )}
//       <input
//         type="text"
//         placeholder="Store Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Address"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="City"
//         value={city}
//         onChange={(e) => setCity(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Province"
//         value={province}
//         onChange={(e) => setProvince(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Country"
//         value={country}
//         onChange={(e) => setCountry(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Postal Code"
//         value={postalCode}
//         onChange={(e) => setPostalCode(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Phone Number"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Latitude"
//         value={latitude}
//         onChange={(e) => setLatitude(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <input
//         type="text"
//         placeholder="Longitude"
//         value={longitude}
//         onChange={(e) => setLongitude(e.target.value)}
//         className="w-full p-3 text-gray-700 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//         required
//       />
//       <div className="flex justify-center">
//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300"
//         >
//           {initialData ? 'Update Store' : 'Add Store'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default StoreForm;
