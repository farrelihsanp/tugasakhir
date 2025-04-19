'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStoreContext } from '@/utility/StoreContext';
import { Cart } from '@/types/types';
import { toast } from 'react-toastify';
import { FaShippingFast, FaCreditCard, FaHeadset } from 'react-icons/fa';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [totalCart, setTotalCart] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useStoreContext();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/api/v1/cart/my-cart', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.ok) setCart(data.data as Cart);
      else toast.error('Gagal memuat data keranjang');
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotal = async () => {
    try {
      const res = await fetch(
        'http://localhost:8000/api/v1/cart/total-amount',
        {
          credentials: 'include',
        },
      );
      const data = await res.json();
      if (data.ok) setTotalCart(data.data);
      else toast.error('Gagal memuat total keranjang');
    } catch (error) {
      console.error('Error fetching total:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchTotal();
  }, []);

  const handleIncrease = async (cartItemId: number) => {
    await fetch('http://localhost:8000/api/v1/cart/plus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cartItemId, quantity: 1 }),
    });
    await fetchCart();
    await fetchTotal();
  };

  const handleDecrease = async (cartItemId: number) => {
    await fetch('http://localhost:8000/api/v1/cart/minus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cartItemId, quantity: 1 }),
    });
    await fetchCart();
    await fetchTotal();
  };

  const handleDelete = async (cartItemId: number) => {
    await fetch('http://localhost:8000/api/v1/cart/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cartItemId: [cartItemId] }),
    });
    await fetchCart();
    await fetchTotal();
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/cart/checkout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCart(data.data);
      await fetchTotal();
      toast.success('Checkout berhasil!');
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!cart || !cart.cartItems || cart.cartItems.length === 0)
    return (
      <div className="text-center py-10 text-lg">Keranjang kamu kosong.</div>
    );

  return (
    <div className="min-h-screen py-8 px-4 md:px-12">
      <div className="relative h-[300px] mb-10">
        <Image
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1374&auto=format&fit=crop"
          alt="Keranjang Belanja"
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center rounded-lg">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Shopping Cart
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between font-semibold text-gray-600 px-4">
            <span>Product</span>
            <span>Quantity</span>
            <span>Amount</span>
          </div>

          {cart.cartItems.map((item) => {
            const isDiscounted =
              item.priceAfterDiscount && item.priceAfterDiscount > 0;
            const totalPrice =
              item.totalAfterDiscount && item.totalAfterDiscount > 0
                ? item.totalAfterDiscount
                : item.total;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white border rounded-lg p-4 shadow"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 w-full sm:w-1/3">
                  <Image
                    src={
                      item.storeProduct?.product?.ProductImages?.[0]
                        ?.imageUrl || '/default.jpg'
                    }
                    alt="produk"
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <div className="font-semibold">
                      {item.storeProduct?.product?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isDiscounted ? (
                        <>
                          <span className="line-through text-red-500">
                            Rp.{Number(item.price).toLocaleString()}
                          </span>{' '}
                          <span className="text-primary font-bold">
                            Rp.
                            {Number(item.priceAfterDiscount).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>Rp.{Number(item.price).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 sm:w-1/3 justify-center mt-4 sm:mt-0">
                  <button
                    onClick={() => handleDecrease(item.id)}
                    className="bg-primary text-white w-7 h-7 rounded-full"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrease(item.id)}
                    className="bg-primary text-white w-7 h-7 rounded-full"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right sm:w-1/3 mt-4 sm:mt-0">
                  <div className="text-sm font-semibold text-primary">
                    Rp.{Number(totalPrice).toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-500 mt-1"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>
              {cart.cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Total</span>
            <span>Rp.{totalCart.toLocaleString()}</span>
          </div>
          <Link href={`/dashboard/${user?.username}/checkout`}>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-2 rounded hover:opacity-90"
            >
              Checkout
            </button>
          </Link>
        </div>
      </div>

      {/* Features & Newsletter */}
      <div className="mt-16">
        <div className="flex flex-col md:flex-row justify-around text-center gap-6 mb-12 ">
          <Feature
            icon={<FaShippingFast />}
            title="Free Shipping"
            desc="Free shipping for orders above $50"
          />
          <Feature
            icon={<FaCreditCard />}
            title="Flexible Payment"
            desc="Multiple secure payment options"
          />
          <Feature
            icon={<FaHeadset />}
            title="24×7 Support"
            desc="We support online all days"
          />
        </div>
        <Newsletter />
      </div>
    </div>
  );
}

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex flex-col items-center p-10">
    <div className="text-4xl text-primary mx-auto">{icon}</div>
    <h3 className="font-bold mt-2">{title}</h3>
    <p className="text-sm text-gray-600">{desc}</p>
  </div>
);

const Newsletter = () => (
  <div className="bg-gray-100 rounded-lg py-10 px-6 text-center shadow">
    <h2 className="text-sm text-gray-500">Our Newsletter</h2>
    <h1 className="text-2xl md:text-3xl font-bold mt-2">
      Subscribe to Our Newsletter to <br />
      <span className="text-green-600">Get Updates on Our Latest Offers</span>
    </h1>
    <p className="text-sm text-gray-600 mt-2 mb-4">
      Get 25% off on your first order just by subscribing to our newsletter
    </p>
    <form className="flex flex-col sm:flex-row justify-center gap-3 mt-4 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter Email Address"
        className="px-4 py-2 rounded-full border w-full sm:w-auto"
      />
      <button
        type="submit"
        className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full"
      >
        Subscribe
      </button>
    </form>
  </div>
);
