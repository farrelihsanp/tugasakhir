'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateCategoryPage: React.FC = () => {
  const { id, userSlug } = useParams();
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    excerpt: '',
    description: '',
    image: null as File | null,
  });

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/category/${id}`,
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name,
            excerpt: data.excerpt,
            description: data.description,
            image: null,
          });
        } else {
          setError('Failed to fetch category');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error fetching category: ${err.message}`);
        }
      }
    };

    fetchCategory();
  }, [id]);

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('excerpt', formData.excerpt);
    formDataToSend.append('description', formData.description);
    if (formData.image) formDataToSend.append('image', formData.image);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/update-category/${id}`,
        {
          method: 'PUT',
          body: formDataToSend,
          credentials: 'include',
        },
      );

      if (response) {
        toast.success('Category updated successfully!');
        router.push('/superadmin/' + userSlug + '/manage-products/category');
      } else {
        toast.error('Failed to update category');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error updating category: ${err.message}`);
        toast.error('Error updating category');
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Update Category
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="excerpt"
              className="block text-gray-700 font-semibold"
            >
              Excerpt
            </label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-semibold"
            >
              Category Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Update Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateCategoryPage;
