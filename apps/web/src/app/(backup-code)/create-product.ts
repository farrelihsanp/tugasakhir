// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// // Define the types for form data and category selection
// interface FormData {
//   name: string;
//   excerpt: string;
//   description: string;
//   weight: string;
//   categoryIds: number[]; // Category IDs to be selected
//   images: File[]; // Added images field to handle file uploads
// }

// interface Category {
//   id: number;
//   name: string;
// }

// const CreateProductPage = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     excerpt: '',
//     description: '',
//     weight: '',
//     categoryIds: [], // Initial state for categoryIds
//     images: [], // Initial state for images
//   });
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [message, setMessage] = useState<string>('');
//   const router = useRouter();

//   // Fetch all categories on mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(
//           'http://localhost:8000/api/v1/all-categories',
//         );
//         const data = await response.json();
//         if (data.ok) {
//           setCategories(data.data);
//         }
//       } catch (error: unknown) {
//         setMessage('Failed to fetch categories');
//         console.error('Error fetching categories:', error);
//         toast.error('Failed to fetch categories');
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle category selection (checkbox)
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const categoryId = parseInt(e.target.value);
//     if (e.target.checked) {
//       setFormData({
//         ...formData,
//         categoryIds: [...formData.categoryIds, categoryId],
//       });
//     } else {
//       setFormData({
//         ...formData,
//         categoryIds: formData.categoryIds.filter((id) => id !== categoryId),
//       });
//     }
//   };

//   // Handle image selection
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const newImages = Array.from(files);

//       if (newImages.length + formData.images.length <= 5) {
//         setFormData({
//           ...formData,
//           images: [...formData.images, ...newImages],
//         });
//       } else {
//         toast.error('You can upload a maximum of 5 images');
//       }
//     }
//   };

//   // Handle image deletion
//   const handleImageDelete = (index: number) => {
//     const updatedImages = formData.images.filter((_, i) => i !== index);
//     setFormData({
//       ...formData,
//       images: updatedImages,
//     });
//   };

//   // Submit form
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Check if categories are selected
//     if (formData.categoryIds.length === 0) {
//       toast.error('Please select at least one category');
//       return;
//     }

//     const formDataToSend = new FormData(); // Using FormData to handle file uploads

//     // Append text fields
//     formDataToSend.append('name', formData.name);
//     formDataToSend.append('excerpt', formData.excerpt);
//     formDataToSend.append('description', formData.description);
//     formDataToSend.append('weight', formData.weight);

//     // Ensure categoryIds is a non-empty array and pass as JSON
//     if (formData.categoryIds.length === 0) {
//       toast.error('Category must be selected');
//       return;
//     }
//     formDataToSend.append('categoryIds', JSON.stringify(formData.categoryIds));

//     // Append images
//     formData.images.forEach((file) => {
//       formDataToSend.append('productImages', file);
//     });

//     try {
//       const response = await fetch(
//         'http://localhost:8000/api/v1/create-product',
//         {
//           method: 'POST',
//           body: formDataToSend,
//           credentials: 'include',
//         },
//       );

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to create product');
//       }

//       toast.success('Product created successfully!');
//       router.push('/dashboard/products');
//     } catch (error: unknown) {
//       console.error('Error creating product:', error);
//       toast.error('An error occurred');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg m-10">
//       <h1 className="text-3xl font-bold mb-6 text-center">Create Product</h1>
//       {message && <p className="text-red-500 mb-4">{message}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Product Name:
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>

//         {/* Excerpt */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Excerpt:
//           </label>
//           <input
//             type="text"
//             name="excerpt"
//             value={formData.excerpt}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Description:
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleTextAreaChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>

//         {/* Weight */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Weight:
//           </label>
//           <input
//             type="number"
//             name="weight"
//             value={formData.weight}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//         </div>

//         {/* Category Selection with checkboxes */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Categories:
//           </label>
//           <div className="space-y-2">
//             {categories.map((category) => (
//               <div key={category.id} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   value={category.id}
//                   checked={formData.categoryIds.includes(category.id)}
//                   onChange={handleCategoryChange}
//                   className="mr-2"
//                 />
//                 <label>{category.name}</label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Selected Categories */}
//         {formData.categoryIds.length > 0 && (
//           <div className="mt-4">
//             <p className="font-medium">Selected Categories:</p>
//             <div className="space-y-2">
//               {formData.categoryIds.map((categoryId) => {
//                 const category = categories.find(
//                   (cat) => cat.id === categoryId,
//                 );
//                 return category ? (
//                   <div
//                     key={category.id}
//                     className="flex items-center justify-between"
//                   >
//                     <span>{category.name}</span>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFormData({
//                           ...formData,
//                           categoryIds: formData.categoryIds.filter(
//                             (id) => id !== category.id,
//                           ),
//                         })
//                       }
//                       className="text-red-500"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ) : null;
//               })}
//             </div>
//           </div>
//         )}

//         {/* Image Upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Product Images (up to 5):
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//           />
//           <div className="mt-2 text-sm text-gray-600">
//             {formData.images.length}{' '}
//             {formData.images.length === 1 ? 'image' : 'images'} selected
//           </div>
//           {/* Display uploaded images with delete button */}
//           <div className="mt-4">
//             {formData.images.map((image, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between mb-2"
//               >
//                 <span>{image.name}</span>
//                 <button
//                   type="button"
//                   onClick={() => handleImageDelete(index)}
//                   className="text-red-500"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-700"
//         >
//           Create Product
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateProductPage;
