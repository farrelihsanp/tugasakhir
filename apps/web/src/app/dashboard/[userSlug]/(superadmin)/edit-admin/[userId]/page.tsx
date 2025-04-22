'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { User, Store } from '@/types/types';

const UpdateAdminPage = () => {
  const { userId } = useParams();
  const router = useRouter();

  const [adminData, setAdminData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    storeId: '',
    profileImage: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  // Fetch admin data based on ID
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/admins/${userId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await res.json();
        if (data.ok) {
          setAdminData(data.data);
          setFormData({
            name: data.data.name,
            email: data.data.email,
            username: data.data.username,
            password: '',
            storeId: data.data.storeId,
            profileImage: null,
          });
        } else {
          toast.error('Admin not found');
        }
      } catch (error: unknown) {
        console.error('Error fetching admin data:', error);
        toast.error('An error occurred while fetching admin data');
      } finally {
        setLoading(false);
      }
    };

    const fetchStores = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/stores`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.ok) {
          setStores(data.data);
          if (adminData) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              storeId: adminData.storeId || data.data[0].id,
            }));
          }
          setLoading(false);
        } else {
          toast.error('Store not found');
        }
      } catch (error: unknown) {
        console.error('Error fetching store data:', error);
        toast.error('An error occurred while fetching store data');
      }
    };

    fetchAdminData();
    fetchStores();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('storeId', formData.storeId);
    if (formData.profileImage) {
      formDataToSend.append('profileImage', formData.profileImage);
    }

    try {
      const res = await fetch(`/api/v1/admins/update/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.ok) {
        toast.success('Admin updated successfully');
        router.push('/admin/list');
      } else {
        toast.error('Failed to update admin');
      }
    } catch (error: unknown) {
      console.error('Error updating admin:', error);
      toast.error('An error occurred while updating admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Admin</h1>
      {adminData ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-lg">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-lg">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-lg">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-lg">Store</label>
            <select
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg">Profile Image</label>
            <input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Admin'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/list')}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>Admin data not found</div>
      )}
    </div>
  );
};

export default UpdateAdminPage;
