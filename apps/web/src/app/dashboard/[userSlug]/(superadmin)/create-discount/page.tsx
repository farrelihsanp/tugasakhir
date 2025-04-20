'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/types';
import { useParams } from 'next/navigation';

export default function CreateDiscountPage() {
  const { userSlug } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    productId: '',
    name: '',
    type: 'AMOUNT',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    expiredAt: '',
    buyOneGetOne: false,
  });
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    fetch('http://localhost:8000/api/v1/all-products', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false); // Set loading to false once data is fetched
        if (data.ok) {
          setProducts(data.data);
        } else {
          toast.error('Failed to load products');
        }
      })
      .catch(() => {
        setLoading(false); // Set loading to false in case of an error
        toast.error('Error fetching product data');
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting the form
    try {
      const res = await fetch('http://localhost:8000/api/v1/create-discount', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(form.productId),
          name: form.name,
          type: form.type,
          value: Number(form.value),
          minPurchase: Number(form.minPurchase),
          maxDiscount: Number(form.maxDiscount),
          expiredAt: form.expiredAt,
          buyOneGetOne: form.buyOneGetOne,
        }),
      });
      const data = await res.json();
      setLoading(false); // Set loading to false after the response
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      router.push(
        `http://localhost:3000/dashboard/${userSlug}/discount-manager`,
      );
    } catch (error: unknown) {
      const err = error as Error;
      setLoading(false); // Set loading to false in case of an error
      toast.error(err.message || 'Failed to create discount');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow-xl mt-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Create Discount Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">Select Product</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="w-full border p-3 rounded bg-white"
            required
          >
            <option value="">-- Select Product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Discount Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., End of Year Promo"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Discount Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="AMOUNT">Discount Amount (Rp)</option>
            <option value="PERCENTAGE">Percentage Discount (%)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Discount Value</label>
          <input
            type="number"
            name="value"
            placeholder="Enter discount value"
            value={form.value}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Minimum Purchase</label>
          <input
            type="number"
            name="minPurchase"
            placeholder="Enter minimum purchase"
            value={form.minPurchase}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Maximum Discount</label>
          <input
            type="number"
            name="maxDiscount"
            placeholder="Enter maximum discount"
            value={form.maxDiscount}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Expiration Date</label>
          <input
            type="date"
            name="expiredAt"
            value={form.expiredAt}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="buyOneGetOne"
            checked={form.buyOneGetOne}
            onChange={handleChange}
            className="h-5 w-5"
          />
          <label className="font-semibold">Enable Buy One Get One Promo</label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : 'Save Discount'}
        </button>
      </form>
    </div>
  );
}
