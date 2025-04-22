'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Store,
  Category,
  Product,
  CheapProducts,
  StoreContextType,
  User,
} from '@/types/types';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cheapProducts, setCheapProducts] = useState<CheapProducts[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [storeStoreAdmin, setStoreStoreAdmin] = useState<Store | null>(null);

  const storeIdStoreAdmin =
    user && user.StoreUser ? user?.StoreUser[0]?.storeId : null;

  /* -------------------------------------------------------------------------- */
  /*                              FETCH CATEGORIES                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/all-categories', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setCategories(data.data);
      } catch (error: unknown) {
        console.error('Fetch error (categories):', error);
        setError(`Failed to fetch categories: ${error}`);
      }
    };

    fetchCategories();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                    FETCH PRODUCT STORE DAN CHEAP PRODUCT                   */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (nearestStore) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(
            `http://localhost:8000/api/v1/products-store/${nearestStore.id}`,
            {
              method: 'GET',
              credentials: 'include',
            },
          );
          const data = await res.json();
          setProducts(data.data);
        } catch (error: unknown) {
          console.error('Fetch error (products):', error);
          setError(`Failed to fetch product data: ${error}`);
        }
      };

      const fetchCheapProduct = async () => {
        try {
          const res = await fetch(
            `http://localhost:8000/api/v1/cheap-products-store/${nearestStore.id}`,
            {
              method: 'GET',
              credentials: 'include',
            },
          );
          const data = await res.json();
          setCheapProducts(data.data);
        } catch (error: unknown) {
          console.error('Fetch error (cheap products):', error);
          setError(`Failed to fetch cheap product data: ${error}`);
        }
      };

      fetchProduct();
      fetchCheapProduct();
    }
  }, [nearestStore]);

  /* -------------------------------------------------------------------------- */
  /*                                 FETCH STORE                                */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (user && user.StoreUser?.length > 0) {
      const fetchStore = async () => {
        try {
          const res = await fetch(
            `http://localhost:8000/api/v1/stores/someStore/${storeIdStoreAdmin}`,
            {
              method: 'GET',
              credentials: 'include',
            },
          );
          const data = await res.json();
          setStoreStoreAdmin(data.data);
        } catch (error: unknown) {
          console.error('Fetch error (store):', error);
          setError(`Failed to fetch store data: ${error}`);
        }
      };

      fetchStore();
    }
  }, [storeIdStoreAdmin, user]);

  /* -------------------------------------------------------------------------- */
  /*                           FETCH YANG SEDAN
  G LOGIN                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchAuthMe = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (error: unknown) {
        console.error('Fetch error (user):', error);
        setError(`Failed to fetch user data: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthMe();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        window.location.href = '/';
      } else {
        throw new Error('Logout failed');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        setUser,
        nearestStore,
        storeStoreAdmin,
        setNearestStore,
        cheapProducts,
        products,
        categories,
        user,
        loading,
        error,
        handleLogout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
