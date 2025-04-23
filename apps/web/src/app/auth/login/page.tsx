'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { ZodError } from 'zod';
import { toast } from 'react-toastify';
import { loginSchema } from '../../../schemas/auth-schemas';
import { useRouter } from 'next/navigation';
import { googleSignIn } from '@/actions/google-sign-in-action';

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      const formData = { emailOrUsername, password };
      loginSchema.parse(formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/auth/login`,
        {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error('Login failed');
      }
      toast.success('Login successful!');
      const fetchUserLogin = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/auth/me`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );

      if (!fetchUserLogin.ok) {
        router.push('/auth/login');
        return;
      }

      const dataUser = await fetchUserLogin.json();
      switch (dataUser.role) {
        case 'CUSTOMERS':
        case 'SUPERADMIN':
        case 'STOREADMIN':
          router.push('/');
          break;
        default:
          router.push('/');
      }

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        for (const issue of error.issues) {
          const fieldName = issue.path[0] as string;
          errors[fieldName] = issue.message;
        }
        setFieldErrors(errors);
        toast.error('Please fix the errors below.');
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Background Image */}
      <div className="w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1614907634002-65ac4cb74acb?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login Illustration"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>

      {/* Right Form */}
      <div className="w-1/2 flex items-center justify-center bg-white px-10">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Email or Username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none ${
                  fieldErrors.emailOrUsername
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {fieldErrors.emailOrUsername && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.emailOrUsername}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <form action={googleSignIn} className="mt-4">
            <button
              type="submit"
              className="w-full py-2 border rounded-md text-sm hover:bg-gray-50"
            >
              Sign in with Google
            </button>
          </form>

          <p className="text-xs text-center mt-6">
            Forgot your password?{' '}
            <Link href="/reset-password" className="text-green-600 font-medium">
              Click here
            </Link>
          </p>

          <p className="text-center mt-4 text-sm">
            Haven’t made an account yet?{' '}
            <Link
              href="/auth/register"
              className="text-green-600 font-semibold"
            >
              Please sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
