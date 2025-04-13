'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStoreContext } from '@/utility/StoreContext';
import { Cart } from '@/types/types';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const { nearestStore } = useStoreContext();
  const { user } = useStoreContext();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/v1/cart/my-cart', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.data as Cart);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateCartItem = (cartItemId: number, change: number) => {
    const updatedCartItems = cart?.cartItems.map((item) =>
      item.id === cartItemId
        ? {
            ...item,
            quantity: Math.max(item.quantity + change, 1),
            total: Math.max((item.quantity + change) * item.price, item.price),
          }
        : item,
    );
    if (cart) {
      setCart({
        ...cart,
        cartItems: updatedCartItems!,
      });
    }
  };

  const handleIncrease = async (cartItemId: number) => {
    updateCartItem(cartItemId, 1);

    try {
      await fetch(`http://localhost:8000/api/v1/cart/plus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cartItemId, quantity: 1 }),
      });
    } catch (error) {
      console.error('Error increasing quantity:', error);
      updateCartItem(cartItemId, -1);
    }
  };

  const handleDecrease = async (cartItemId: number) => {
    updateCartItem(cartItemId, -1);

    try {
      await fetch(`http://localhost:8000/api/v1/cart/minus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cartItemId, quantity: 1 }),
      });
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      updateCartItem(cartItemId, 1);
    }
  };

  const handleDelete = async (cartItemId: number) => {
    try {
      await fetch(`http://localhost:8000/api/v1/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cartItemId: [cartItemId] }),
      });

      setCart({
        ...cart!,
        cartItems:
          cart?.cartItems.filter((item) => item.id !== cartItemId) ?? [],
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/cart/checkout`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setCart(data.data);
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return <div>Your cart is empty</div>;
  }

  const total = cart.cartItems.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen flex flex-col gap-4 justify-center">
      <h1 className="text-center text-2xl font-bold mb-6">CART</h1>
      {cart.cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center gap-4">
            <div>
              <Image
                src={item.storeProduct?.product?.ProductImages?.[0]?.imageUrl}
                alt="produk-photo"
                width={100}
                height={100}
                className="w-16 h-auto"
              />
            </div>
            <div>
              <div className="font-semibold">
                {item.storeProduct?.product?.name}
              </div>
              <div className="text-sm text-gray-500">
                Rp.{Number(item.price)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleDecrease(item.id)}>➖</button>
            <span>{item.quantity}</span>
            <button onClick={() => handleIncrease(item.id)}>➕</button>
          </div>
          <div className="text-right">
            <div className="text-sm">Rp.{item.total}</div>
            <button
              className="text-xs text-red-500"
              onClick={() => handleDelete(item.id)}
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
      <div className="text-right mt-4 font-semibold">TOTAL Rp.{total}</div>
      <div className="text-center mt-6">
        <Link
          href={`/dashboard/${user?.username}/checkout`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          <button onClick={handleCheckout}>Checkout</button>
        </Link>
      </div>
    </div>
  );
}
