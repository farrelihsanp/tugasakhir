'use client';

import React, { useEffect, useState } from 'react';
import { Store, User } from '@prisma/client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function AssignAdminPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // state for loading

  const router = useRouter();
  const { userSlug } = useParams();

  useEffect(() => {
    // Fetch all stores
    const fetchStores = async () => {
      setLoading(true); // Show loading when fetching stores
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/stores`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) throw new Error('Failed to fetch stores');
        const data = await res.json();
        setStores(data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false); // Hide loading after fetching
      }
    };

    // Fetch all store admins
    const fetchAdmins = async () => {
      setLoading(true); // Show loading when fetching admins
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/admins/getAllAdmins`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!res.ok) throw new Error('Failed to fetch admins');
        const data = await res.json();
        setAdmins(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false); // Hide loading after fetching
      }
    };

    fetchStores();
    fetchAdmins();
  }, []);

  const handleAssignAdmin = async () => {
    if (!selectedStore || !selectedAdmin) {
      setError('Please select both store and admin.');
      return;
    }

    try {
      setLoading(true); // Show loading when assigning admin
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/admins/assign-store-admin`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            userId: selectedAdmin,
            storeId: selectedStore,
          }),
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      router.push(
        `${process.env.NEXT_PUBLIC_WEB_DOMAIN}/dashboard/${userSlug}/manage-store-admin`,
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      // Show error toast
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-quaternary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-tertiary mb-6">
          Assign Store Admin
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-6">
          <label htmlFor="store" className="block text-primary mb-2">
            Store
          </label>
          <select
            id="store"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select Store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="admin" className="block text-primary mb-2">
            Store Admin
          </label>
          <select
            id="admin"
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Select Admin</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssignAdmin}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary transition duration-300"
          disabled={loading} // Disable the button while loading
        >
          {loading ? 'Assigning...' : 'Assign Store Admin'}
        </button>
      </div>
    </div>
  );
}
