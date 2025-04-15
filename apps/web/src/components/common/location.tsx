'use client';

import { useState } from 'react';

interface Store {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

const StoreForm: React.FC = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/find-nearest-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }

      const data = await response.json();
      setStore(data);
    } catch (error: unknown) {
      console.error(error);
      setError('An error occurred while fetching the nearest store.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Find Nearest Store</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="latitude"
            className="block text-gray-700 font-bold mb-2"
          >
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="longitude"
            className="block text-gray-700 font-bold mb-2"
          >
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Find Store
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {store && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Nearest Store</h3>
          <p className="text-gray-700">Name: {store.name}</p>
          <p className="text-gray-700">Latitude: {store.latitude}</p>
          <p className="text-gray-700">Longitude: {store.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default StoreForm;
