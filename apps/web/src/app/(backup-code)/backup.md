'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ZodError } from 'zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSchema } from '../../schemas/auth-schemas';
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

      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      toast.success('Login successful!');

      // ----------------------------------------------------------------
      const fetchUserLogin = await fetch(
        'http://localhost:8000/api/v1/auth/me',
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
          router.push('/');
          break;
        case 'SUPERADMIN':
          router.push('/');
          break;
        case 'STOREADMIN':
          router.push('/');
          break;
        default:
          router.push('/');
          break;
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">
              Email or Username
            </label>
            <input
              type="text"
              className={`border border-gray-300 rounded w-full p-2 ${fieldErrors.emailOrUsername ? 'border-red-500' : ''}`}
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
            {fieldErrors.emailOrUsername && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.emailOrUsername}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              className={`border border-gray-300 rounded w-full p-2 ${fieldErrors.password ? 'border-red-500' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <form action={googleSignIn}>
          <button type="submit">Signin with Google</button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Haven’t made an account yet?
          <Link
            href="/auth/register"
            className="text-green-600 hover:underline"
          >
            Please sign up
          </Link>
        </p>
        <p className="mt-1 text-sm text-center text-gray-600">
          forgot your password?
          <Link
            href="/reset-password"
            className="text-green-600 hover:underline"
          >
            click here
          </Link>
        </p>
      </div>
    </div>
  );
}
