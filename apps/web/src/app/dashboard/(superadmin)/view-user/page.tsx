'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from '@prisma/client';

const AllUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error fetching users: ${err.message}`);
        }
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/users/${id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          setError('Failed to delete user');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error deleting user: ${err.message}`);
        }
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          All Users - Role Customers
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <table className="min-w-full table-auto border-separate border-spacing-0 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 text-gray-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 transition-colors duration-300"
              >
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-4">
                    <div>
                      <Link
                        href={`view-user/${user.id}`}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AllUsersPage;
