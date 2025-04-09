'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface ShippingCost {
  name: string;
  cost: number;
  etd: string;
  description: string;
  code: string;
  service: string;
}

interface Voucher {
  id: number;
  name: string;
}

interface Address {
  id: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

interface Cart {
  id: number;
  productId: number;
  quantity: number;
  totalAmount: number;
  valueVoucher: number;
  totalAmountAfterVoucher: number;
}

const OrderForm = () => {
  const { storeSlug } = useParams();
  const [shippingCost, setShippingCost] = useState<ShippingCost[] | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cart, setCart] = useState<Cart>();
  const [selectedShipping, setSelectedShipping] = useState<ShippingCost | null>(
    null,
  );
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    'MIDTRANS' | 'BANK-TRANSFER'
  >('MIDTRANS');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [finalShippingCost, setFinalShippingCost] = useState<number | null>(
    null,
  );

  const valueVoucher = cart?.valueVoucher;
  const totalAmount = cart?.totalAmount;
  const totalAmountAfterVoucher = cart?.totalAmountAfterVoucher;
  const addressPrimary = addresses.find((address) => address.isPrimary);

  useEffect(() => {
    if (!storeSlug) {
      setError('Store slug is required');
      return;
    }

    const fetchShippingCost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/shipping-cost/calculate/${storeSlug}`,
          { credentials: 'include' },
        );
        if (!response.ok) throw new Error('Failed to fetch shipping cost');
        const data = await response.json();
        if (data.ok) {
          setShippingCost(data.data.data);
        } else {
          throw new Error('Could not calculate shipping cost');
        }
      } catch (error: unknown) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchVouchers = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/my-voucher',
          { credentials: 'include' },
        );
        const data = await response.json();
        if (data.ok) {
          setVouchers(data.data);
        } else {
          toast.error('Failed to fetch vouchers');
        }
      } catch (error: unknown) {
        console.error('Error fetching vouchers:', error);
        toast.error('Error fetching vouchers');
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/addresses/user-addresses',
          { credentials: 'include' },
        );
        const data = await response.json();
        if (data.ok) {
          setAddresses(data.data);
        } else {
          toast.error('Failed to fetch addresses');
        }
      } catch (error: unknown) {
        console.error('Error fetching addresses:', error);
        toast.error('Error fetching addresses');
      }
    };

    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/v1/cart/my-cart',
          { credentials: 'include' },
        );
        const data = await response.json();
        if (data.ok) {
          setCart(data.data);
        } else {
          toast.error('Failed to fetch cart items');
        }
      } catch (error: unknown) {
        console.error('Error fetching cart items:', error);
        toast.error('Error fetching cart items');
      }
    };

    fetchShippingCost();
    fetchVouchers();
    fetchAddresses();
    fetchCartItems();
  }, [storeSlug]);

  const handleVoucherApply = async () => {
    setLoading(true);
    setError(null);

    if (!selectedVoucher || !selectedShipping || !selectedAddress) {
      toast.error('Please select a voucher, shipping, and address.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/apply-voucher',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voucherId: selectedVoucher,
            shippingCostSelected: selectedShipping.cost,
          }),
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (data.ok) {
        toast.success('Voucher applied successfully');
        setFinalShippingCost(
          data.data.finalShippingCost || selectedShipping.cost,
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error: unknown) {
      setError((error as Error).message);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setSelectedShipping(null);
    } else {
      const selectedOption = JSON.parse(value);
      setSelectedShipping(selectedOption);
    }
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    setError(null);

    const selectedShippingDetails: ShippingCost = selectedShipping
      ? selectedShipping
      : ({} as ShippingCost);

    const courierName = selectedShippingDetails.name || '';
    const etd = selectedShippingDetails.etd || '';
    const cost = selectedShippingDetails.cost || '';
    const description = selectedShippingDetails.description || '';
    const serviceType = selectedShippingDetails.service || '';
    const code = selectedShippingDetails.code || '';

    const orderData = {
      paymentMethodType: paymentMethod,
      voucherId: selectedVoucher,
      addressId: selectedAddress,
      courierName: courierName,
      code: code,
      serviceType: serviceType,
      description: description,
      shippingCost: finalShippingCost || cost,
      estimatedTime: etd,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/create-order-${paymentMethod.toLowerCase()}/${storeSlug}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (data.ok) {
        toast.success('Order created successfully');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: unknown) {
      setError((error as Error).message);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryAddress = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/addresses/set-primary',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ addressId: selectedAddress }),
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (data.ok) {
        toast.success('Primary address updated successfully');
      } else {
        throw new Error(data.message);
      }
    } catch (error: unknown) {
      setError((error as Error).message);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-xl border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Create Order
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            className="w-full border rounded-md p-3 bg-gray-50 text-gray-700"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as 'MIDTRANS' | 'BANK-TRANSFER')
            }
          >
            <option value="MIDTRANS">Pay with MidTrans</option>
            <option value="BANK-TRANSFER">Pay with Bank Transfer</option>
          </select>
        </div>

        {/* Voucher */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voucher
          </label>
          <select
            className="w-full border rounded-md p-3 bg-gray-50 text-gray-700"
            value={selectedVoucher || ''}
            onChange={(e) => setSelectedVoucher(e.target.value)}
          >
            <option value="">Select Voucher</option>
            {vouchers.map((voucher) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.name}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Voucher Button */}
        <div className="mb-6">
          <button
            onClick={handleVoucherApply}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Applying Voucher...' : 'Apply Voucher'}
          </button>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Address
          </label>
          <select
            className="w-full border rounded-md p-3 bg-gray-50 text-gray-700"
            value={selectedAddress || ''}
            onChange={(e) => setSelectedAddress(e.target.value)}
          >
            <option value="">Select Address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.street}, {address.city}, {address.country}
              </option>
            ))}
          </select>
        </div>

        {/* Set Primary Address Button */}
        <div className="mb-6">
          <button
            onClick={handleSetPrimaryAddress}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Setting Primary...' : 'Set as Primary Address'}
          </button>
        </div>

        {/* Shipping Cost */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Cost
          </label>
          <select
            className="w-full border rounded-md p-3 bg-gray-50 text-gray-700"
            value={selectedShipping ? JSON.stringify(selectedShipping) : ''}
            onChange={handleShippingSelect}
          >
            <option value="">Select Courier</option>
            {shippingCost?.map((map, index) => (
              <option
                key={index}
                value={JSON.stringify({
                  name: map.name,
                  etd: map.etd,
                  cost: map.cost,
                  description: map.description,
                  service: map.service,
                  code: map.code,
                })}
              >
                {map.name} - {map.etd} - {map.cost} - {map.description} -{' '}
                {map.service} - {map.code}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Order Button */}
        <div className="mb-6">
          <button
            onClick={handleOrderSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Order'}
          </button>
        </div>
      </div>

      {/* Display Total Amount */}
      <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-200 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Hasil Akhir
        </h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-lg font-medium text-gray-800">
            Total Belanja: {totalAmount}
          </p>
          {totalAmountAfterVoucher ? (
            <p className="text-lg font-medium text-gray-800">
              Total Belanja Setelah Voucher: {totalAmountAfterVoucher}
            </p>
          ) : null}
          {valueVoucher ? (
            <p className="text-lg font-medium text-gray-800">
              Potongan Harga: {valueVoucher}
            </p>
          ) : null}
          <p className="text-lg font-medium text-gray-800">
            Shipping Cost:{' '}
            {selectedShipping
              ? `${selectedShipping.cost}`
              : 'Please select a courier first'}
          </p>
        </div>

        <div>
          {addressPrimary ? (
            <p className="text-lg font-medium text-gray-800">
              Alamat Pengiriman: {addressPrimary.street}, {addressPrimary.city},{' '}
              {addressPrimary.country}
            </p>
          ) : (
            <p className="text-lg font-medium text-gray-800">
              Alamat Pengiriman belum diatur
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
