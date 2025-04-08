'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [emailInput, setEmailInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!emailInput) {
      setErrorMessage('Email is required!');
      return;
    }

    setIsLoading(true); // Start loading

    localStorage.setItem('email', emailInput);

    try {
      // Kirim permintaan POST ke API register
      const response = await fetch(
        'http://localhost:8000/api/v1/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailInput }),
        },
      );

      if (response.ok) {
        setSuccessMessage(
          'Registration successful! Please check your email for confirmation.',
        );
        setErrorMessage('');
        toast.success('Registration successful!'); // Success toastify
        setTimeout(() => {
          window.location.href = 'http://localhost:3000'; // Redirect after success
        }, 3000); // Wait 3 seconds before redirect
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'An error occurred, please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred, please try again later.');
      setSuccessMessage('');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmailInput(savedEmail);
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={emailInput}
                onChange={handleEmailChange}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm">{successMessage}</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? 'Registering...' : 'Register'}{' '}
              {/* Display loading text */}
            </button>
            {isLoading && (
              <div className="text-center mt-4">
                <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 w-6 h-6 rounded-full"></div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
