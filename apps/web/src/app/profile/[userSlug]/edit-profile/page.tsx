'use client';

import React, { useState, useEffect } from 'react';
import { useStoreContext } from '@/utility/StoreContext';
import { toast } from 'react-toastify';

const UpdateProfileForm = () => {
  const { user, handleLogout } = useStoreContext();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername(user.username || '');
      setEmail(user.email || '');
      if (user?.profileImage) {
        const file = new File([user.profileImage], 'profileImage', {
          type: 'image/jpeg',
        });
        setProfileImage(file);
      } else {
        setProfileImage(null);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (!name || !username || !email || !password) {
      setError('All fields are required');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    const existingProfileImage = user?.profileImage;
    if (profileImage) {
      formData.append('profileImage', profileImage);
    } else if (existingProfileImage) {
      formData.append('profileImage', existingProfileImage);
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/auth/update-profile/${user?.id}`,
        {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        },
      );

      if (response.ok) {
        await response.json();
        setSuccess('Profile updated successfully');
        toast.success('Profile updated successfully!');
        handleLogout();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred while updating the profile');
        toast.error(
          data.error || 'An error occurred while updating the profile',
        );
      }
    } catch (error: unknown) {
      setError((error as Error).message || 'Something went wrong');
      toast.error((error as Error).message || 'Something went wrong');
    } finally {
      setIsLoading(false); // Reset loading after completion
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="mx-auto w-96 p-6 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-center mb-4">{success}</p>
          )}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="profileImage"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateProfileForm;
