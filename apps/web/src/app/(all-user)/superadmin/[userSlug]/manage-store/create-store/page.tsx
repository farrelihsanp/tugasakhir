'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import the toast function

// Define the shape of the form data
interface IFormData {
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  latitude: string;
  longitude: string;
  maxServiceDistance: string;
  storeImage: File | null;
}

const CreateStorePage: React.FC = () => {
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    phoneNumber: '',
    latitude: '',
    longitude: '',
    maxServiceDistance: '',
    storeImage: null,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        storeImage: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formDataWithFile = new FormData();

    // Add form data and handle file uploads properly
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'storeImage' && value !== null) {
        formDataWithFile.append(key, value);
      } else {
        formDataWithFile.append(key, value as string); // Typecast the value as string
      }
    });

    try {
      const response = await fetch('http://localhost:8000/api/v1/stores', {
        method: 'POST',
        body: formDataWithFile,
        credentials: 'include',
      });

      if (response.ok) {
        // Show success toast notification
        toast.success('Store created successfully!');
        router.push('/manage-store');
      } else {
        setError('Failed to create store');
        // Show error toast notification
        toast.error('Failed to create store');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error creating store: ${err.message}`);
        // Show error toast notification
        toast.error(`Error creating store: ${err.message}`);
      }
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Create Store
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Store Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="province"
            placeholder="Province"
            value={formData.province}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="maxServiceDistance"
            placeholder="Max Service Distance (in km)"
            value={formData.maxServiceDistance}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="file"
            name="storeImage"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className={`w-full p-3 bg-blue-500 text-white rounded-md ${loading && 'opacity-50'}`}
            disabled={loading}
          >
            {loading ? 'Creating Store...' : 'Create Store'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateStorePage;
