'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
}

export default function CreateDiscountPage() {
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
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/all-products', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setProducts(data.data);
        } else {
          toast.error('Gagal memuat produk');
        }
      })
      .catch(() => toast.error('Terjadi kesalahan saat mengambil data produk'));
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
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      router.push('/discount-manager');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Gagal membuat diskon');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl shadow-xl mt-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Formulir Pembuatan Diskon
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">Pilih Produk</label>
          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="w-full border p-3 rounded bg-white"
            required
          >
            <option value="">-- Pilih Produk --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nama Diskon</label>
          <input
            type="text"
            name="name"
            placeholder="Contoh: Promo Akhir Tahun"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tipe Diskon</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="AMOUNT">Potongan Harga (Rp)</option>
            <option value="PERCENTAGE">Diskon Persentase (%)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nilai Diskon</label>
          <input
            type="number"
            name="value"
            placeholder="Masukkan nilai diskon"
            value={form.value}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Minimal Pembelian</label>
          <input
            type="number"
            name="minPurchase"
            placeholder="Masukkan minimal pembelian"
            value={form.minPurchase}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Diskon Maksimal</label>
          <input
            type="number"
            name="maxDiscount"
            placeholder="Masukkan diskon maksimal yang bisa diterapkan"
            value={form.maxDiscount}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            Tanggal Kedaluwarsa
          </label>
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
          <label className="font-semibold">
            Aktifkan promo Buy One Get One
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Simpan Diskon
        </button>
      </form>
    </div>
  );
}
