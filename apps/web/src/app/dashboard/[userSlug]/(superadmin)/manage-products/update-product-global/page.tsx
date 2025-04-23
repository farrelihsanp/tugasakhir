'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import type { Product, Category, FormData } from '@/types/types';
import { useParams } from 'next/navigation';

const UpdateProductPage = () => {
  const { userSlug } = useParams();

  const [formData, setFormData] = useState<FormData>({
    productId: '',
    name: '',
    excerpt: '',
    description: '',
    price: '',
    weight: '',
    categoryId: 0,
    images: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/all-categories`,
        );
        const data = await response.json();
        if (data.ok) {
          setCategories(data.data);
        }
      } catch (error) {
        setMessage('Failed to fetch categories');
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/all-products`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        if (data.ok) {
          setProducts(data.data);
        }
      } catch (error) {
        setMessage('Failed to fetch products');
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle category selection (dropdown)
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, categoryId: parseInt(e.target.value) });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      if (newImages.length + formData.images.length <= 5) {
        setFormData({
          ...formData,
          images: [...formData.images, ...newImages],
        });
      } else {
        toast.error('You can upload a maximum of 5 images');
      }
    }
  };

  // Handle image deletion
  const handleImageDelete = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.categoryId === 0) {
      toast.error('Please select a category');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('productId', formData.productId);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('excerpt', formData.excerpt);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('weight', formData.weight);
    formDataToSend.append('categoryId[]', String(formData.categoryId));
    formData.images.forEach((file) => {
      formDataToSend.append('productImages', file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/update-product-global`,
        {
          method: 'PUT',
          body: formDataToSend,
          credentials: 'include',
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update product');
      }
      toast.success('Product updated successfully!');
      router.push(
        `${process.env.NEXT_PUBLIC_WEB_DOMAIN}/dashboard/${userSlug}/manage-products`,
      );
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg m-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Product</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Product:
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleSelectChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Excerpt:
          </label>
          <input
            type="text"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextAreaChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight:
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categories:
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleCategoryChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Images (up to 5):
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="mt-2 text-sm text-gray-600">
            {formData.images.length}{' '}
            {formData.images.length === 1 ? 'image' : 'images'} selected
          </div>
          <div className="mt-4">
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-2"
              >
                <span>{image.name}</span>
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-indigo-700"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProductPage;
