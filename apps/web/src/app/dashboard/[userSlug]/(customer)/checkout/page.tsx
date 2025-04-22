'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStoreContext } from '@/utility/StoreContext';
import { ShippingCost, Voucher, Address } from '@/types/types';
import { VoucherCategory } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Cart } from '@/types/types';

const OrderForm = () => {
  const router = useRouter();
  const { user } = useStoreContext();
  const { nearestStore } = useStoreContext();
  const storeSlug = nearestStore?.slug;

  // ---------------------------------------------------------------------------------

  // fetch data raja ongkir untuk pilihan pengiriman
  const [shippingCostRajaOngkir, setShippingCostRajaOngkir] = useState<
    ShippingCost[] | null
  >(null);

  const [vouchers, setVouchers] = useState<Voucher[]>([]); // voucher user
  const [addresses, setAddresses] = useState<Address[]>([]); // alamat user
  const [cart, setCart] = useState<Cart | null>(null); // cart user (menampilkan informasi total belanjaan setelah diapply voucher)
  const [selectedShipping, setSelectedShipping] = useState<ShippingCost | null>(
    null,
  ); // kurir terpilih
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null); // isinya Id voucher terpilih
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null); // isinya id address terpilih
  const [savedSelectedVoucher, setSavedSelectedVoucher] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedVoucherFulldata = vouchers.find((voucher) => {
    return voucher.id === Number(selectedVoucher);
  });

  /* -------------------------------------------------------------------------- */
  /*                                MENGOLAH CART                               */
  /* -------------------------------------------------------------------------- */

  const value = cart?.CartValueCalculation;

  const totalAmountCart = value?.totalAmountCart;
  const totalAmountCartAfterVoucher = value?.totalAmountCartAfterVoucher;
  const valueVoucherCart = value?.valueVoucherCart;

  const shippingCost = value?.shippingCost;
  const shippingCostAfterVoucher = value?.shippingCostAfterVoucher;
  const valueVoucherShipping = value?.valueVoucherShipping;

  // --------------------------------------------------------------------------------
  const addressPrimary = addresses.find((address) => address.isPrimary);
  // --------------------------------------------------------------------------------
  useEffect(() => {
    if (selectedVoucher) {
      localStorage.setItem('selectedVoucher', selectedVoucher);
    } else {
      const savedVoucher = localStorage.getItem('selectedVoucher');
      if (savedVoucher !== null) {
        setSavedSelectedVoucher(Number(savedVoucher));
      } else {
        setSavedSelectedVoucher(null);
      }
    }
  }, [selectedVoucher]);

  useEffect(() => {
    if (selectedShipping) {
      localStorage.setItem(
        'selectedShipping',
        JSON.stringify(selectedShipping),
      );
    } else {
      const savedShipping = localStorage.getItem('selectedShipping');
      if (savedShipping !== null) {
        setSelectedShipping(JSON.parse(savedShipping));
      } else {
        setSelectedShipping(null);
      }
    }
  }, [selectedShipping]);

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
          setShippingCostRajaOngkir(data.data.data);
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

    if (!selectedVoucherFulldata) {
      toast.error('Please select a voucher');
      setLoading(false);
      return;
    }

    if (selectedVoucherFulldata.voucherCategory === VoucherCategory.PRODUCT) {
      toast.error('Product voucher cannot be applied in this page');
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
              voucherId: selectedVoucher,
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
              voucherId: selectedVoucher,
              shippingCostSelected: selectedShipping?.cost,
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
      }, 3000);
    }
  };

  const handleRemoveVoucher = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'http://localhost:8000/api/v1/remove-voucher',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ voucherId: savedSelectedVoucher }),
        },
      );

      const data = await response.json();
      if (data.ok) {
        toast.success('Voucher removed successfully');
        setSavedSelectedVoucher(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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

  const handleOrderSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!selectedShipping) {
      toast.error('Please select a shipping and address.');
      setLoading(false);
      return;
    }

    const orderData = {
      courierName: selectedShipping?.name || '',
      code: selectedShipping?.code || '',
      serviceType: selectedShipping?.service || '',
      description: selectedShipping?.description || '',
      shippingCostFinal:
        shippingCostAfterVoucher || shippingCost || selectedShipping?.cost || 0,
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
        router.push(
          `http://localhost:3000/dashboard/${user?.username}/${data.data.id}/payment`,
        );
        localStorage.removeItem('selectedVoucher');
        localStorage.removeItem('selectedShipping');
        setSavedSelectedVoucher(null);
        setSelectedShipping(null);
        setSelectedVoucher(null);
        setSelectedAddress(null);
        setSavedSelectedVoucher(null);
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

  let removeVoucherCart = null;

  if (totalAmountCartAfterVoucher && valueVoucherCart) {
    removeVoucherCart = (
      <button
        onClick={() => handleRemoveVoucher()}
        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300"
        disabled={loading}
      >
        {loading ? 'Removing Voucher...' : 'Remove Voucher'}
      </button>
    );
  }

  let removeVoucherShipping = null;

  if (shippingCostAfterVoucher && valueVoucherShipping) {
    removeVoucherShipping = (
      <button
        onClick={() => handleRemoveVoucher()}
        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300"
        disabled={loading || !savedSelectedVoucher}
      >
        {loading ? 'Removing Voucher...' : 'Remove Voucher'}
      </button>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center ">
      <div>
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Create Order
        </h2>
      </div>

      <div className="flex justify-center items-center gap-10 ">
        <div className="container max-w-lg mx-auto p-8 bg-white shadow-xl rounded-xl border border-gray-200 h-full">
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">
            Settings
          </h3>

          {/* Voucher */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voucher
            </label>
            <select
              className="w-full border rounded-md p-3 bg-gray-50 text-gray-700"
              value={selectedVoucher || ''}
              onChange={(e) => {
                setSelectedVoucher(e.target.value);
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
              className={`w-full py-3 rounded-md transition duration-300 ${
                loading ||
                totalAmountCartAfterVoucher ||
                shippingCostAfterVoucher
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-primary hover:bg-green-400 text-white'
              }`}
              disabled={Boolean(
                loading ||
                  totalAmountCartAfterVoucher ||
                  shippingCostAfterVoucher,
              )}
            >
              {loading
                ? 'Loading...'
                : totalAmountCartAfterVoucher || shippingCostAfterVoucher
                  ? 'Voucher sudah diaplikasikan'
                  : 'Apply Voucher'}
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
              className={`w-full text-white py-3 rounded-md transition duration-300 ${
                loading ||
                totalAmountCartAfterVoucher ||
                shippingCostAfterVoucher
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary'
              }`}
              disabled={Boolean(
                loading ||
                  totalAmountCartAfterVoucher ||
                  shippingCostAfterVoucher,
              )}
            >
              {loading
                ? 'Setting Primary Address...'
                : totalAmountCartAfterVoucher || shippingCostAfterVoucher
                  ? 'Cannot set primary address'
                  : 'Set Primary Address'}
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
              {shippingCostRajaOngkir?.map((map, index) => (
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
        </div>
        {/* Display Total Amount */}
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-2xl border border-gray-300 h-full">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">
            Result Order
          </h3>
          <div className="bg-gray-100 p-6 rounded-xl">
            <div className="mb-4">
              <p className="text-lg font-medium text-gray-800">
                Hasil Belanjaan: <br />
                {totalAmountCartAfterVoucher ? (
                  <span>
                    <span className="line-through text-gray-500">
                      {totalAmountCart}
                    </span>{' '}
                    <span className="text-xl font-semibold text-gray-800">
                      {totalAmountCartAfterVoucher}
                    </span>
                    <span className="text-sm text-gray-500">
                      {' '}
                      (Kamu untung: {valueVoucherCart})
                    </span>
                  </span>
                ) : (
                  <span className="text-xl font-semibold text-gray-800">
                    {totalAmountCart}
                  </span>
                )}
              </p>
            </div>
            <div className={`mb-6 ${!removeVoucherCart && 'hidden'}`}>
              {removeVoucherCart}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-800">
                Shipping Cost: <br />
                {shippingCostAfterVoucher ? (
                  <span>
                    <span className="line-through text-gray-500">
                      {shippingCost || 0}
                    </span>{' '}
                    <span className="text-xl font-semibold text-gray-800">
                      {shippingCostAfterVoucher}
                    </span>
                    <span className="text-sm text-gray-500">
                      {' '}
                      (Kamu untung: {valueVoucherShipping})
                    </span>
                  </span>
                ) : (
                  <span className="text-xl font-semibold text-gray-800">
                    {selectedShipping?.cost || 0}
                  </span>
                )}
              </p>
            </div>
            <div className={`mb-6 ${!removeVoucherShipping && 'hidden'}`}>
              {removeVoucherShipping}
            </div>
          </div>

          <div>
            {addressPrimary ? (
              <p className="text-lg font-medium text-gray-800 mt-5">
                Alamat Pengiriman: <br />
                <span className="font-semibold text-gray-900">
                  {addressPrimary.street}, {addressPrimary.city},{' '}
                  {addressPrimary.country}
                </span>
              </p>
            ) : (
              <p className="text-lg font-medium text-gray-600">
                Alamat Pengiriman belum diatur
              </p>
            )}
          </div>
          <div className="mt-3">
            Total Order: <br />
            <span className="text-xl font-semibold text-gray-800">
              {(shippingCostAfterVoucher || selectedShipping?.cost || 0) +
                (totalAmountCartAfterVoucher || totalAmountCart || 0)}
            </span>
          </div>
          {/* Submit Order Button */}
          <div className="mt-5">
            <button
              onClick={handleOrderSubmit}
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-green-400 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Order'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
