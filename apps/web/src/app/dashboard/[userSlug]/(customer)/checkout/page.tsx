'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from '@/utility/StoreContext';
import { ShippingCost, Voucher, Address } from '@/types/types';
import { VoucherCategory } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface Cart {
  id: number;
  productId: number;
  quantity: number;
  totalAmount: number;
  valueVoucher: number;
  totalAmountAfterVoucher: number;
}

const OrderForm = () => {
  const router = useRouter();
  const { user } = useStoreContext();
  const { nearestStore } = useStoreContext();
  const storeSlug = nearestStore?.slug;
  // fetch data raja ongkir untuk pilihan pengiriman
  const [shippingCost, setShippingCost] = useState<ShippingCost[] | null>(null);
  // voucher user
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  // alamat user
  const [addresses, setAddresses] = useState<Address[]>([]);
  // cart user (menampilkan informasi total belanjaan setelah diapply voucher)
  const [cart, setCart] = useState<Cart | null>(null);

  // kurir terpilih
  const [selectedShipping, setSelectedShipping] = useState<ShippingCost | null>(
    null,
  );

  // isinya Id voucher terpilih
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  // isinya id address terpilih
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  // isinya shipping cost setelah diapply voucher
  const [shippingCostAfterVoucher, setShippingCostAfterVoucher] = useState<
    number | null
  >(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedVoucherFulldata = vouchers.find((voucher) => {
    return voucher.id === Number(selectedVoucher);
  });

  const totalAmount = cart?.totalAmount;
  const totalAmountAfterVoucher = cart?.totalAmountAfterVoucher;
  const addressPrimary = addresses.find((address) => address.isPrimary);

  // ---
  useEffect(() => {
    const storedShippingCost = localStorage.getItem('shippingCostAfterVoucher');
    if (storedShippingCost) {
      setShippingCostAfterVoucher(JSON.parse(storedShippingCost));
    }

    const savedSelectedVoucher = localStorage.getItem('selectedVoucher');
    if (savedSelectedVoucher) {
      setSelectedVoucher(savedSelectedVoucher);
    }
  }, [shippingCostAfterVoucher, selectedVoucher]);

  useEffect(() => {
    const storedSelectedShipping = localStorage.getItem('selectedShipping');
    if (storedSelectedShipping) {
      const parsedShipping = JSON.parse(storedSelectedShipping);
      setSelectedShipping(parsedShipping); // Menyimpan ke state
    }
  }, []);

  // --- Fetch logic
  useEffect(() => {
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

    // const savedSelectedVoucher = localStorage.getItem('selectedVoucher');
    // if (savedSelectedVoucher) {
    //   setSelectedVoucher(savedSelectedVoucher);
    // }

    fetchShippingCost();
    fetchVouchers();
    fetchAddresses();
    fetchCartItems();
  }, [storeSlug]);

  const handleVoucherApply = async () => {
    setLoading(true);
    setError(null);

    if (!selectedVoucherFulldata) {
      toast.error('Please select a voucher');
      setLoading(false);
      return;
    }

    if (selectedVoucherFulldata.voucherCategory === VoucherCategory.PRODUCT) {
      toast.error('Product voucher cannot be applied');
      setLoading(false);
      return;
    }

    try {
      if (
        selectedVoucherFulldata.voucherCategory ===
        VoucherCategory.SHOPPING_RESULT
      ) {
        const response = await fetch(
          'http://localhost:8000/api/v1/apply-voucher-to-cart',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              voucherId: selectedVoucherFulldata.id,
            }),
          },
        );

        const data = await response.json();
        if (data.ok) {
          toast.success('Voucher applied successfully');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          throw new Error(data.message);
        }
      } else if (
        selectedShipping &&
        selectedVoucherFulldata.voucherCategory ===
          VoucherCategory.SHIPPING_COST
      ) {
        const response = await fetch(
          'http://localhost:8000/api/v1/apply-voucher-to-shipping-cost',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              voucherId: selectedVoucherFulldata.id,
              shippingCostSelected: selectedShipping?.cost,
            }),
          },
        );

        const data = await response.json();
        if (data.ok) {
          setShippingCostAfterVoucher(data.data);
          localStorage.setItem(
            'shippingCostAfterVoucher',
            JSON.stringify(data.data),
          );
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          toast.success('Voucher applied successfully');
        } else {
          throw new Error(data.message);
        }
      } else {
        throw new Error('Invalid voucher category');
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
      localStorage.setItem('selectedShipping', value);
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
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!selectedShipping) {
      toast.error('Please select a shipping and address.');
      setLoading(false);
      return;
    }

    const orderData = {
      // voucherId: selectedVoucher,
      // addressId: addressPrimary?.id,
      // ----
      courierName: selectedShipping?.name || '',
      code: selectedShipping?.code || '',
      serviceType: selectedShipping?.service || '',
      description: selectedShipping?.description || '',
      shippingCost: shippingCostAfterVoucher || selectedShipping?.cost || '',
      estimatedTime: selectedShipping?.etd || '',
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/create-order/${storeSlug}`,
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
        localStorage.removeItem('shippingCostAfterVoucher');
        router.push(`http://localhost:3000/dashboard/${user?.username}/orders`);
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

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="container max-w-lg mx-auto p-8 bg-white shadow-xl rounded-xl border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Create Order
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {/* Voucher */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voucher
          </label>
          <select
            className="w-full border rounded-md p-3 bg-gray-50 text-gray-700"
            value={selectedVoucher || ''}
            onChange={(e) => {
              const voucherId = e.target.value;
              setSelectedVoucher(voucherId);
              localStorage.setItem('selectedVoucher', voucherId);
            }}
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
            Hasil Belanjaan:{' '}
            {totalAmountAfterVoucher ? (
              <span>
                <span className="line-through text-gray-500">
                  {totalAmount}
                </span>{' '}
                {totalAmountAfterVoucher}
              </span>
            ) : (
              totalAmount
            )}
          </p>
          <p className="text-lg font-medium text-gray-800">
            Shipping Cost:{' '}
            {shippingCostAfterVoucher ? (
              <span>
                <span className="line-through text-gray-500">
                  {selectedShipping?.cost || 0}
                </span>{' '}
                {shippingCostAfterVoucher}
              </span>
            ) : (
              selectedShipping?.cost || 0
            )}
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
