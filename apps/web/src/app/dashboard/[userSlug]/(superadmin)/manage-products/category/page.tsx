'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Category } from '@/types/types';

const ManageCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/all-categories`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          },
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data.data);
        } else {
          setError('Failed to fetch categories');
          toast.error('Failed to fetch categories');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error fetching categories: ${err.message}`);
          toast.error(`Error fetching categories: ${err.message}`);
        }
      }
    };

    fetchCategories();
  }, []);

  const deleteCategory = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/delete-category/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      if (response) {
        setCategories(categories.filter((category) => category.id !== id));
        toast.success('Category deleted successfully');
      } else {
        toast.error('Failed to delete category');
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error deleting category: ${err.message}`);
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center  py-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Manage Categories
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <table className="min-w-full table-auto border-separate border-spacing-0 rounded-lg overflow-hidden shadow-md">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Excerpt</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 text-gray-800">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-gray-100 transition-colors duration-300"
              >
                <td className="px-6 py-4">{category.id}</td>
                <td className="px-6 py-4">{category.name}</td>
                <td className="px-6 py-4">{category.excerpt}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-4">
                    <Link
                      href={`category/${category.id}`}
                      className="text-green-500 hover:text-green-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 text-center">
          <Link
            href="category/create"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Create Category
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ManageCategoriesPage;
