'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import the toast function
import { useParams } from 'next/navigation';

interface ICategoryFormData {
  name: string;
  excerpt: string;
  description: string;
  image: File | null;
}

const CreateCategoryPage: React.FC = () => {
  const [formData, setFormData] = useState<ICategoryFormData>({
    name: '',
    excerpt: '',
    description: '',
    image: null,
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { userSlug } = useParams();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formDataWithFile = new FormData();

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value !== null) {
        formDataWithFile.append(key, value);
      } else {
        formDataWithFile.append(key, value as string); // Typecast the value as string
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/categories`,
        {
          method: 'POST',
          body: formDataWithFile,
          credentials: 'include',
        },
      );

      if (response.ok) {
        // Show success toast notification
        toast.success('Category created successfully!');
        router.push('/superadmin/' + userSlug + '/manage-products/category');
      } else {
        setError('Failed to create category');
        // Show error toast notification
        toast.error('Failed to create category');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error creating category: ${err.message}`);
        // Show error toast notification
        toast.error(`Error creating category: ${err.message}`);
      }
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex items-center justify-center  py-8">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          Create Category
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <textarea
            name="excerpt"
            placeholder="Excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className={`w-full p-3 bg-primary text-white rounded-md ${loading && 'opacity-50'}`}
            disabled={loading}
          >
            {loading ? 'Creating Category...' : 'Create Category'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateCategoryPage;
