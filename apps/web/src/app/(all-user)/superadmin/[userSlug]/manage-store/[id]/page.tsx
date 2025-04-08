'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Define the Store interface
interface Store {
  id: number;
  name: string;
  storeImage: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  slug: string;
  latitude: number;
  longitude: number;
  maxServiceDistance: number | null;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Add any other fields that might be required based on the schema
}

const StoreDetail = () => {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/stores/someStore/${id}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStore(data); // Set the full store data
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]); // Fetch the store whenever the id changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto pt-14">
        {/* Back Button */}
        <button className="mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <Link href="/storelisting" className="text-gray-600">
            Back to Listing
          </Link>
        </button>

        {/* Store Header */}
        <div className="relative w-full h-60 mb-6">
          <Image
            src={store.storeImage}
            alt={store.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Store Title */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{store.name}</h1>
          </div>
        </div>

        {/* Store Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* Address */}
            <div>
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p>{store.address}</p>
              <p>
                {store.city}, {store.province}, {store.country}
              </p>
              <p>{store.postalCode}</p>
            </div>

            {/* Phone Number */}
            <div>
              <h3 className="font-bold text-lg mb-2">Phone Number</h3>
              <p>{store.phoneNumber}</p>
            </div>

            {/* Max Service Distance */}
            {store.maxServiceDistance && (
              <div>
                <h3 className="font-bold text-lg mb-2">Max Service Distance</h3>
                <p>{store.maxServiceDistance} km</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6 text-right">
            {/* Store Coordinates */}
            <div>
              <h3 className="font-bold text-lg mb-2">Coordinates</h3>
              <p>Latitude: {store.latitude}</p>
              <p>Longitude: {store.longitude}</p>
            </div>

            {/* Active Status */}
            <div>
              <h3 className="font-bold text-lg mb-2">Store Status</h3>
              <p>{store.isActive ? 'Active' : 'Inactive'}</p>
            </div>

            {/* Primary Status */}
            <div>
              <h3 className="font-bold text-lg mb-2">Primary Store</h3>
              <p>{store.isPrimary ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreDetail;
