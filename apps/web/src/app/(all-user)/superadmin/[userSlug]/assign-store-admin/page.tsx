'use client';

import React, { useEffect, useState } from 'react';
import { Store, User } from '@prisma/client';

export default function AssignAdminPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all stores
    const fetchStores = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/stores', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch stores');
        const data = await res.json();
        setStores(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    // Fetch all store admins
    const fetchAdmins = async () => {
      try {
        const res = await fetch(
          'http://localhost:8000/api/v1/admins/getAllAdmins',
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
      const res = await fetch(
        'http://localhost:8000/api/v1/admins/assign-store-admin',
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

      alert(data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assign Store Admin</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label htmlFor="store" className="block">
          Store
        </label>
        <select
          id="store"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="admin" className="block">
          Store Admin
        </label>
        <select
          id="admin"
          value={selectedAdmin}
          onChange={(e) => setSelectedAdmin(e.target.value)}
          className="border p-2 rounded"
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
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Assign Store Admin
      </button>
    </div>
  );
}
