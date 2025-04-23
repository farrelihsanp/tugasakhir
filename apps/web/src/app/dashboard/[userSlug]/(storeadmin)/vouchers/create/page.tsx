'use client';

import { useEffect, useState } from 'react';
import { VoucherCategory, VoucherType } from '@prisma/client';
import { useStoreContext } from '@/utility/StoreContext';
import { Product } from '@/types/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

const CreateVoucher = () => {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const { storeStoreAdmin, user } = useStoreContext();
  const storeId = storeStoreAdmin?.id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (storeId) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/products-store/${storeId}`,
            {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          const data = await response.json();
          if (!data.ok) {
            throw new Error('Failed to fetch products');
          }
          setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [storeStoreAdmin, storeId]);

  const [voucherData, setVoucherData] = useState({
    name: '',
    description: '',
    code: '',
    voucherType: 'AMOUNT',
    voucherCategory: 'SHOPPING_RESULT',
    value: '',
    startDate: '',
    endDate: '',
    stock: '',
    isActive: true,
    minPurchase: '',
    maxPriceReduction: '',
    productId: '',
    storeId: storeId || null,
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setVoucherData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', voucherData.name);
    formData.append('description', voucherData.description);
    formData.append('code', voucherData.code);
    formData.append('voucherType', voucherData.voucherType);
    formData.append('voucherCategory', voucherData.voucherCategory);
    formData.append('value', voucherData.value);
    formData.append('startDate', voucherData.startDate);
    formData.append('endDate', voucherData.endDate);
    formData.append('stock', voucherData.stock);
    formData.append('minPurchase', voucherData.minPurchase);
    formData.append('maxPriceReduction', voucherData.maxPriceReduction);
    if (voucherData.productId) {
      formData.append('productId', voucherData.productId);
    }
    if (voucherData.storeId) {
      formData.append('storeId', voucherData.storeId.toString());
    }
    if (voucherData.image) {
      formData.append('voucherImage', voucherData.image as Blob);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/create-voucher`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );
      const result = await response.json();
      if (result.ok) {
        toast.success('Voucher created successfully!');
        router.push(
          `${process.env.NEXT_PUBLIC_WEB_DOMAIN}/dashboard/${user?.username}/vouchers`,
        );
      } else {
        toast.error('Error creating voucher');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating voucher');
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Create Voucher</h2>
        <form onSubmit={handleSubmit}>
          {/* Voucher Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Voucher Name
            </label>
            <input
              type="text"
              name="name"
              value={voucherData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={voucherData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Voucher Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Voucher Code
            </label>
            <input
              type="text"
              name="code"
              value={voucherData.code}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Voucher Value */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Voucher Value
            </label>
            <input
              type="number"
              name="value"
              value={voucherData.value}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={voucherData.stock}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Optional Product Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product (Optional)
            </label>
            <select
              name="productId"
              value={voucherData.productId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Product (Optional)</option>
              {products?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Voucher Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Voucher Category
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  name="voucherCategory"
                  value={VoucherCategory.SHOPPING_RESULT}
                  checked={
                    voucherData.voucherCategory ===
                    VoucherCategory.SHOPPING_RESULT
                  }
                  onChange={handleRadioChange}
                />
                Shopping Result
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="voucherCategory"
                  value={VoucherCategory.SHIPPING_COST}
                  checked={
                    voucherData.voucherCategory ===
                    VoucherCategory.SHIPPING_COST
                  }
                  onChange={handleRadioChange}
                />
                Shipping Cost
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="voucherCategory"
                  value={VoucherCategory.PRODUCT}
                  checked={
                    voucherData.voucherCategory === VoucherCategory.PRODUCT
                  }
                  onChange={handleRadioChange}
                />
                Product
              </label>
            </div>
          </div>

          {/* Voucher Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Voucher Type
            </label>
            <div>
              <label>
                <input
                  type="radio"
                  name="voucherType"
                  value={VoucherType.AMOUNT}
                  checked={voucherData.voucherType === VoucherType.AMOUNT}
                  onChange={handleRadioChange}
                />
                Amount
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="voucherType"
                  value={VoucherType.PERCENTAGE}
                  checked={voucherData.voucherType === VoucherType.PERCENTAGE}
                  onChange={handleRadioChange}
                />
                Percentage
              </label>
            </div>
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={voucherData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={voucherData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Min Purchase */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Min Purchase
            </label>
            <input
              type="number"
              name="minPurchase"
              value={voucherData.minPurchase}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Max Price Reduction */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Max Price Reduction
            </label>
            <input
              type="number"
              name="maxPriceReduction"
              value={voucherData.maxPriceReduction}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* File Input for Voucher Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Voucher Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
            />
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  width={200}
                  height={200}
                  alt="Voucher Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
            >
              Create Voucher
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateVoucher;
