'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const [emailInput, setEmailInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!emailInput) {
      setErrorMessage('Email is required!');
      return;
    }

    setIsLoading(true);
    localStorage.setItem('email', emailInput);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailInput }),
        },
      );

      if (response.ok) {
        setSuccessMessage('Registration successful! Please check your email.');
        setErrorMessage('');
        toast.success('Registration successful!');
        setTimeout(() => {
          window.location.href = process.env.NEXT_PUBLIC_WEB_DOMAIN as string;
        }, 3000);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) setEmailInput(savedEmail);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left Image */}
      <div className="w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1526470498-9ae73c665de8?q=80&w=1396&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Register Illustration"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>

      {/* Right Form */}
      <div className="w-1/2 flex items-center justify-center bg-white px-10">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Create Account
          </h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={emailInput}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none ${
                  errorMessage ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-1">{successMessage}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
