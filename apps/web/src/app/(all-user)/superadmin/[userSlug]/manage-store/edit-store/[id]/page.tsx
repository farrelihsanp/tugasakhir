'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Store = {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  storeImage: string;
  maxServiceDistance: number;
};

export default function EditStorePage() {
  const { id, userSlug } = useParams() as { id: string; userSlug: string };

  console.log('userSlug isinya :', userSlug);
  console.log('id isinya :', id);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Store>({
    id: 0,
    name: '',
    address: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    phoneNumber: '',
    storeImage: '',
    maxServiceDistance: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/stores/someStore/${id}`,
          {
            credentials: 'include',
          },
        );
        const data = await res.json();
        if (res.ok) {
          setFormData({
            id: data.id,
            name: data.name,
            address: data.address,
            city: data.city,
            province: data.province,
            country: data.country,
            postalCode: data.postalCode,
            phoneNumber: data.phoneNumber,
            storeImage: data.storeImage,
            maxServiceDistance: data.maxServiceDistance / 1000, // Convert from meters to kilometers
          });
          setLoading(false);
        } else {
          throw new Error(data.error || 'Failed to fetch store data');
        }
      } catch (err: unknown) {
        setError(String(err));
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append('name', formData.name);
    formDataWithImage.append('address', formData.address);
    formDataWithImage.append('city', formData.city);
    formDataWithImage.append('province', formData.province);
    formDataWithImage.append('country', formData.country);
    formDataWithImage.append('postalCode', formData.postalCode);
    formDataWithImage.append('phoneNumber', formData.phoneNumber);
    formDataWithImage.append(
      'maxServiceDistance',
      String(formData.maxServiceDistance * 1000),
    ); // Convert to meters
    formDataWithImage.append('storeImage', selectedImage as Blob);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/stores/${id}`, {
        method: 'PUT',
        body: formDataWithImage,
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Store updated successfully!');
        router.push(`/superadmin/${userSlug}/manage-store`);
      } else {
        throw new Error(data.error || 'Failed to update store');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error updating store: ${err.message}`);
      }
      toast.error('Error updating store');
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center font-medium">Loading store data...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">{error}</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Store</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Store Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium">
            Store Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-lg font-medium">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-lg font-medium">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Province */}
        <div>
          <label htmlFor="province" className="block text-lg font-medium">
            Province
          </label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-lg font-medium">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-lg font-medium">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-lg font-medium">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Max Service Distance */}
        <div>
          <label
            htmlFor="maxServiceDistance"
            className="block text-lg font-medium"
          >
            Max Service Distance (in km)
          </label>
          <input
            type="number"
            id="maxServiceDistance"
            name="maxServiceDistance"
            value={formData.maxServiceDistance}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="storeImage" className="block text-lg font-medium">
            Store Image
          </label>
          <input
            type="file"
            id="storeImage"
            name="storeImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-2"
          />
          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                width={2000}
                height={2000}
                alt="Store Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Update Store
        </button>
      </form>
    </div>
  );
}
