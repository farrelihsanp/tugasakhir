'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Voucher, VoucherType, VoucherCategory } from '@/types/types';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useStoreContext } from '@/utility/StoreContext';

const UpdateVoucher = () => {
  const router = useRouter();
  const { voucherCode } = useParams();
  const { user } = useStoreContext();

  const [voucherData, setVoucherData] = useState<Voucher>({
    id: 0,
    name: '',
    description: '',
    code: voucherCode as string,
    voucherType: VoucherType.AMOUNT,
    voucherCategory: VoucherCategory.SHOPPING_RESULT,
    value: 0,
    startDate: '',
    endDate: '',
    stock: 0,
    stockVoucherAdmin: 0,
    isActive: true,
    minPurchase: 0,
    maxPriceReduction: 0,
    voucherImage: '',
    VoucherUser: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const ImageEdit = imagePreview?.trim();

  useEffect(() => {
    if (voucherCode) {
      const fetchVoucherData = async (voucherCode: string) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/get-voucher-by-code/${voucherCode}`,
            {
              method: 'GET',
              credentials: 'include',
            },
          );
          const data = await response.json();
          if (data.ok) {
            setVoucherData({
              ...data.data,
              id: data.data.id,
              name: data.data.name,
              description: data.data.description,
              value: data.data.value,
              startDate: data.data.startDate,
              endDate: data.data.endDate,
              stock: data.data.stockVoucherAdmin,
              minPurchase: data.data.minPurchase,
              maxPriceReduction: data.data.maxPriceReduction,
              code: data.data.code,
              stockVoucherAdmin: data.data.stockVoucherAdmin,
              voucherType: data.data.voucherType,
              voucherCategory: data.data.voucherCategory,
              voucherImage: data.data.voucherImage || '',
            });
            setImagePreview(data.data.voucherImage);
          } else {
            toast.error('Error fetching voucher data');
          }
        } catch (error) {
          console.error('Error fetching voucher data:', error);
          toast.error('Error fetching voucher data');
        }
      };

      fetchVoucherData(voucherCode as string);
    }
  }, [voucherCode]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      setVoucherData((prevData) => ({
        ...prevData,
        voucherImage: URL.createObjectURL(file),
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', voucherData.name);
    formData.append('description', voucherData.description);
    formData.append('voucherType', voucherData.voucherType);
    formData.append('voucherCategory', voucherData.voucherCategory);
    formData.append('value', voucherData.value.toString());
    formData.append('startDate', voucherData.startDate);
    formData.append('endDate', voucherData.endDate);
    formData.append('stock', voucherData.stock.toString());
    formData.append('minPurchase', voucherData.minPurchase.toString());
    formData.append(
      'maxPriceReduction',
      voucherData.maxPriceReduction.toString(),
    );
    if (selectedFile) {
      formData.append('voucherImage', selectedFile);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/update-voucher/${voucherCode}`,
        {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        },
      );
      const result = await response.json();
      if (result.ok) {
        toast.success('Voucher updated successfully');
        router.push(
          `${process.env.NEXT_PUBLIC_WEB_DOMAIN}/dashboard/${user?.username}/vouchers`,
        );
      } else {
        toast.error('Error updating voucher');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating voucher');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Update Voucher</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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

        {/* Voucher Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Voucher Type
          </label>
          <div className="flex">
            <label className="mr-4">
              <input
                type="radio"
                name="voucherType"
                value="PERCENTAGE"
                checked={voucherData.voucherType === 'PERCENTAGE'}
                onChange={handleInputChange}
              />
              Percentage
            </label>
            <label>
              <input
                type="radio"
                name="voucherType"
                value="AMOUNT"
                checked={voucherData.voucherType === 'AMOUNT'}
                onChange={handleInputChange}
              />
              Amount
            </label>
          </div>
        </div>

        {/* Voucher Category */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Voucher Category
          </label>
          <div className="flex">
            <label className="mr-4">
              <input
                type="radio"
                name="voucherCategory"
                value={VoucherCategory.SHOPPING_RESULT}
                checked={
                  voucherData.voucherCategory ===
                  VoucherCategory.SHOPPING_RESULT
                }
                onChange={handleInputChange}
              />
              Shopping Result
            </label>
            <label>
              <input
                type="radio"
                name="voucherCategory"
                value={VoucherCategory.SHIPPING_COST}
                checked={
                  voucherData.voucherCategory === VoucherCategory.SHIPPING_COST
                }
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
              Product
            </label>
          </div>
        </div> */}

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

        {/* Min Purchase */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Min Purchase
          </label>
          <input
            type="number"
            name="minPurchase"
            value={voucherData.minPurchase || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
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
            value={voucherData.maxPriceReduction || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Voucher Image */}
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
              {imagePreview && ImageEdit && (
                <div className="mt-4">
                  <Image
                    src={ImageEdit}
                    width={200}
                    height={200}
                    alt="Voucher Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white rounded-md"
          >
            Update Voucher
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateVoucher;
