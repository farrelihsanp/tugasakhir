'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LogoutModalProps {
  onClose: () => void;
  onLogoutSuccess?: () => void;
}

export default function LogoutModal({
  onClose,
  onLogoutSuccess,
}: LogoutModalProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleYesLogout = async () => {
    setMessage('');
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      setMessage('You have successfully logged out.');
      // [HIGHLIGHT] panggil callback => agar Navbar tahu user= null
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }

      // Tutuplah modal + optional redirect
      setTimeout(() => {
        onClose();
        router.push('/');
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  const handleNo = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Logout</h2>
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to log out from Quickmart?
        </p>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleNo}
            className="border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            No
          </button>
          <button
            onClick={handleYesLogout}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Yes
          </button>
        </div>

        {message && (
          <p className="mt-4 text-green-600 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
}
