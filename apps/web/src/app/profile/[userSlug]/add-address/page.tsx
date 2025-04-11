'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreContext } from '@/utility/StoreContext';
// import { convertAddressToCoordinates } from '@/../../apps/api/src/utils/geocode';

const AddAddressForm = () => {
  const { user } = useStoreContext();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [number, setNumber] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!street || !city || !postalCode || !number || !country) {
      setError('Please fill all fields');
      return;
    }

    const addressData = {
      street,
      city,
      postalCode,
      number,
      country,
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
        credentials: 'include',
      });

      if (response.ok) {
        router.push(`/customer/${user?.username}/my-addresses`);
      } else {
        const data = await response.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'An error occurred while adding the address');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="mx-auto w-96 p-6 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Add Address</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="street"
            >
              Street
            </label>
            <input
              type="text"
              id="street"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="city"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="postalCode"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="number"
            >
              Number
            </label>
            <input
              type="text"
              id="number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="country"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Address
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddressForm;
