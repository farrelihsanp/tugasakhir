'use client';

import React, { useEffect, useState } from 'react';
import { useStoreContext } from '@/utility/StoreContext';
import Link from 'next/link';
import { Address } from '@prisma/client';

const AddressPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [primaryAddress, setPrimaryAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStoreContext();

  useEffect(() => {
    const fetchAddressesAndPrimary = async () => {
      setIsLoading(true);
      try {
        // Fetch all addresses
        const addressRes = await fetch(
          `http://localhost:8000/api/v1/addresses/user/${user?.id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!addressRes.ok) {
          throw new Error('Failed to fetch addresses');
        }
        const addressData = await addressRes.json();
        setAddresses(addressData.data);

        // Fetch primary address
        const primaryRes = await fetch(
          `http://localhost:8000/api/v1/addresses/get-primary`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (!primaryRes.ok) {
          throw new Error('Failed to fetch primary address');
        }
        const primaryData = await primaryRes.json();
        setPrimaryAddress(primaryData.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id !== 0) {
      fetchAddressesAndPrimary();
    }
  }, [user?.id]);

  const handleDeleteAddress = async (id: number) => {
    const res = await fetch(`http://localhost:8000/api/v1/addresses/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } else {
      const error = await res.json();
      console.error('Error deleting address:', error);
    }
  };

  const handleSetPrimary = async (id: number) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/addresses/set-primary`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ addressIds: id }),
      },
    );

    if (res.ok) {
      await res.json();
      setAddresses((prev) =>
        prev.map((address) =>
          address.id === id ? { ...address, isPrimary: true } : address,
        ),
      );
    } else {
      const error = await res.json();
      console.error('Error setting primary address:', error);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">Manage Addresses</h1>

        {error && (
          <div className="text-red-500 mb-4 p-4 rounded-md bg-red-100">
            {error}
          </div>
        )}

        <section className="bg-gray-50 p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Primary Address
          </h2>
          {isLoading ? (
            <div className="text-center text-gray-500">
              Loading primary address...
            </div>
          ) : primaryAddress ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-800">
                {primaryAddress.street}, {primaryAddress.city},{' '}
                {primaryAddress.country}
              </p>
              <p className="text-md text-gray-600">
                {primaryAddress.postalCode}
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-500">No primary address set.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Addresses
          </h2>
          {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left">Street</th>
                    <th className="py-3 px-4 text-left">City</th>
                    <th className="py-3 px-4 text-left">Postal Code</th>
                    <th className="py-3 px-4 text-left">Number</th>
                    <th className="py-3 px-4 text-left">Country</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((address) => (
                    <tr key={address.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{address.street}</td>
                      <td className="py-3 px-4">{address.city}</td>
                      <td className="py-3 px-4">{address.postalCode}</td>
                      <td className="py-3 px-4">{address.number}</td>
                      <td className="py-3 px-4">{address.country}</td>
                      <td className="py-3 px-4 space-x-2 flex justify-start gap-2">
                        <button
                          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
                          onClick={() => handleSetPrimary(address.id)}
                        >
                          Set Primary
                        </button>
                        <Link
                          href={`/customer/${user?.username}/edit-address/${address.id}`}
                          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="text-center">
          <Link
            href={`/customer/${user?.username}/add-address`}
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add New Address
          </Link>
        </section>
      </div>
    </section>
  );
};

export default AddressPage;
