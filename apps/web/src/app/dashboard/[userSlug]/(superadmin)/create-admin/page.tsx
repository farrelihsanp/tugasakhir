'use client';

import React, { useState, useEffect } from 'react';
import { Store } from '@/types/types';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const CreateAdminForm: React.FC = () => {
  const router = useRouter();
  const { userSlug } = useParams();

  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
    storeId: '',
    adminImage: null as File | null,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/stores');
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        const data = await response.json();
        setStores(data.data);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };

    fetchStores();
  }, []);

  // Handle input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    if (name === 'adminImage' && 'files' in target && target.files) {
      setFormData({
        ...formData,
        adminImage: target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.username ||
      !formData.storeId
    ) {
      setError('Please fill all fields');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('username', formData.username);
    form.append('storeId', formData.storeId);

    if (formData.adminImage) {
      form.append('adminImage', formData.adminImage);
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/admins/create',
        {
          method: 'POST',
          credentials: 'include',
          body: form,
        },
      );
      if (response.ok) {
        toast.success('Admin created successfully!');
        setError(null);
        setFormData({
          name: '',
          email: '',
          password: '',
          username: '',
          storeId: '',
          adminImage: null,
        });
        router.push(
          `http://localhost:3000/dashboard/${userSlug}/manage-store-admin`,
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('An error occurred while creating the admin');
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Admin
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Store:</label>
            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Profile Image:</label>
            <input
              type="file"
              name="adminImage"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-indigo-600"
            disabled={loading}
          >
            {loading ? 'Creating Admin...' : 'Create Admin'}{' '}
            {/* Show loading text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminForm;
