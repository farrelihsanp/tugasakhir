// 'use client';

// import { useStoreContext } from '../../utility/StoreContext';
// import Image from 'next/image';
// import Link from 'next/link';

// import { ProductItemProps } from '@/types/types';

// // New component for individual product display
// const ProductItem = ({
//   name,
//   imageUrl,
//   price,
//   excerpt,
//   stock,
// }: ProductItemProps) => {
//   return (
//     <div className="border border-gray-300 shadow-xl rounded-lg w-64 h-auto flex-shrink-0 mx-2 snap-start">
//       <Link href="#">
//         <div className="relative h-48 w-full">
//           <Image
//             src={
//               imageUrl ||
//               'https://dummyimage.com/600x400/90ee90/fff&text=DUMMY-PHOTO'
//             }
//             alt={name || 'Product'}
//             fill
//             className="object-cover rounded-t-lg"
//             style={{ objectFit: 'cover' }}
//           />
//         </div>
//         <div className="p-4">
//           <h2 className="text-lg font-semibold text-center">{name}</h2>
//           <p className="font-semibold mt-2 text-center">
//             Rp. {price.toLocaleString()}
//           </p>
//           <p className="text-gray-500 mt-2 text-center">{excerpt}</p>
//           <p className="text-gray-500 mt-2 text-center">Stock: {stock}</p>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export const ProductsPage = () => {
//   const { cheapProducts, loading, error } = useStoreContext();

//   return (
//     <section>
//       <div className="container mx-auto px-5 mt-10 min-h-screen">
//         <h1 className="text-2xl font-bold mb-10 text-center">Cheap Products</h1>
//         {error ? (
//           <p className="text-red-500">Error: {error}</p>
//         ) : loading ? (
//           <p>Loading products...</p>
//         ) : cheapProducts && cheapProducts.length > 0 ? (
//           <div className="flex overflow-x-auto space-x-4 pb-10 scroll-smooth snap-x snap-mandatory">
//             {cheapProducts.map((map) => {
//               return (
//                 <ProductItem
//                   key={map.id}
//                   name={map.name}
//                   imageUrl={map.product.ProductImages[0].imageUrl || ''}
//                   price={map.price}
//                   excerpt={map.product.excerpt}
//                   stock={map.stock}
//                 />
//               );
//             })}
//           </div>
//         ) : (
//           <p>No cheap products found.</p>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ProductsPage;
