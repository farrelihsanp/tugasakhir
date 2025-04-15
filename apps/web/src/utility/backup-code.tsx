// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import {
//   Store,
//   Category,
//   Product,
//   CheapProducts,
//   StoreContextType,
//   User,
// } from '@/types/types';

// const StoreContext = createContext<StoreContextType | undefined>(undefined);

// export const useStoreContext = () => {
//   const context = useContext(StoreContext);
//   if (context === undefined) {
//     throw new Error('useStoreContext must be used within a StoreProvider');
//   }
//   return context;
// };

// export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [nearestStore, setNearestStore] = useState<Store | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [cheapProducts, setCheapProducts] = useState<CheapProducts[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [storeStoreAdmin, setStoreStoreAdmin] = useState<Store | null>(null);

//   const storeIdStoreAdmin = user?.StoreUser[0]?.storeId;

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     fetch('http://localhost:8000/api/v1/auth/me', {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setUser(data);
//       })
//       .catch((error) => {
//         console.error('Fetch error (user):', error);
//         setError(`Failed to fetch user data: ${error.message}`);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     fetch('http://localhost:8000/api/v1/all-categories')
//       .then((res) => res.json())
//       .then((data) => {
//         setCategories(data.data);
//       })
//       .catch((error) => {
//         console.error('Fetch error (categories):', error);
//         setError(`Failed to fetch categories: ${error.message}`);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     if (!nearestStore?.id) return;

//     setLoading(true);
//     setError(null);

//     const fetchProducts = fetch(
//       `http://localhost:8000/api/v1/products-store/${nearestStore.id}`,
//     ).then((res) => res.json());

//     const fetchCheapProducts = fetch(
//       `http://localhost:8000/api/v1/cheap-products-store/${nearestStore.id}`,
//     ).then((res) => res.json());

//     const fetchStore = fetch(
//       `http://localhost:8000/api/v1/stores/someStore/${storeIdStoreAdmin}`,
//     ).then((res) => res.json());

//     Promise.all([fetchProducts, fetchCheapProducts, fetchStore])
//       .then(([productData, cheapProductsData, storeData]) => {
//         setStoreStoreAdmin(storeData.data);
//         setProducts(productData.data);
//         if (cheapProductsData?.data) {
//           setCheapProducts(cheapProductsData.data);
//         } else {
//           console.warn(
//             'Cheap Products data is empty or not in the expected format',
//           );
//         }
//       })
//       .catch((error) => {
//         console.error('Fetch error (products):', error);
//         setError(`Failed to fetch product data: ${error.message}`);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [nearestStore, storeIdStoreAdmin]);

//   // Handle logout within the context
//   const handleLogout = async () => {
//     try {
//       const response = await fetch('http://localhost:8000/api/v1/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//       if (response.ok) {
//         setUser(null);
//         window.location.href = '/';
//       } else {
//         throw new Error('Logout failed');
//       }
//     } catch (err) {
//       setError((err as Error).message);
//     }
//   };

//   return (
//     <StoreContext.Provider
//       value={{
//         nearestStore,
//         storeStoreAdmin,
//         setNearestStore,
//         cheapProducts,
//         products,
//         categories,
//         user,
//         loading,
//         error,
//         handleLogout,
//       }}
//     >
//       {children}
//     </StoreContext.Provider>
//   );
// };
