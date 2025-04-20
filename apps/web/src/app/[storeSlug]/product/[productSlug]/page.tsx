'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Product, Discount } from '@/types/types';
import { useStoreContext } from '@/utility/StoreContext';
import { Role } from '@prisma/client';
import { toast } from 'react-toastify';

export default function ProductDetailPage() {
  const { storeSlug, productSlug } = useParams();
  const { user } = useStoreContext();

  const [productData, setProductData] = useState<Product | null>(null);
  const [discountData, setDiscountData] = useState<Discount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const productId = productData?.product.id;

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/detail-product/${storeSlug}/${productSlug}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch product');
        setProductData(data.data);
      } catch (error: unknown) {
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [storeSlug, productSlug]);

  useEffect(() => {
    if (productId && productData?.priceAfterDiscount > 0) {
      const fetchDiscount = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            'http://localhost:8000/api/v1/discount-for-product',
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ productId }),
            },
          );
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.error || 'Failed to fetch discount');
          setDiscountData(data.data);
        } catch (error: unknown) {
          setError((error as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDiscount();
    }
  }, [productId, productData?.priceAfterDiscount]);

  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);

  if (error)
    return (
      <div className="p-6 text-red-500 text-center font-semibold animate-pulse">
        Error: {error}
      </div>
    );
  if (isLoading)
    return (
      <div className="p-6 text-center font-medium animate-pulse">
        Loading...
      </div>
    );
  if (!productData)
    return (
      <div className="p-6 text-center font-medium animate-pulse">
        Product not found
      </div>
    );

  const { product, price, priceAfterDiscount, stock } = productData;
  const effectivePrice = priceAfterDiscount > 0 ? priceAfterDiscount : price;
  const total = Number(effectivePrice) * qty;

  const addToCartHandler = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/cart/add/${storeSlug}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ productId: product.id, quantity: qty }),
        },
      );
      const data = await res.json();
      if (res.ok) toast.success('Product added to cart successfully!');
      else throw new Error(data.error || 'Failed to add product to cart');
    } catch (err: unknown) {
      toast.error(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-40 h-[60vh] p-6 grid md:grid-cols-2 gap-10 items-start animate-fade-in">
      <div className="space-y-6">
        {product.ProductImages[0] && (
          <Image
            src={product.ProductImages[0].imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-xl object-cover mx-auto hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="grid grid-cols-4 gap-4">
          {product.ProductImages.slice(1, 5).map((img) => (
            <Image
              key={img.id}
              src={img.imageUrl}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-md object-cover hover:opacity-80 transition-opacity duration-300"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 text-left">
        <h1 className="text-3xl font-bold text-tertiary">{product.name}</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-2">
          <p>
            <span className="font-semibold">Harga</span>:
            {priceAfterDiscount > 0 ? (
              <>
                <span className="line-through text-gray-400 ml-2">
                  Rp. {Number(price).toLocaleString('id-ID')}
                </span>
                <span className="text-primary font-bold ml-2">
                  Rp. {Number(priceAfterDiscount).toLocaleString('id-ID')}
                </span>
              </>
            ) : (
              <span className="ml-2">
                Rp. {Number(price).toLocaleString('id-ID')}
              </span>
            )}
          </p>
          <p>
            <span className="font-semibold">Stock</span>: {stock} items
          </p>
          <p>
            <span className="font-semibold">Berat</span>: {product.weight} gram
          </p>
        </div>

        {discountData.length > 0 && (
          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
            <h3 className="font-bold text-yellow-800 mb-2">Diskon Tersedia</h3>
            {discountData.map((disc, idx) => (
              <div key={idx} className="text-sm text-yellow-900">
                <p>
                  <strong>{disc.name}</strong>
                </p>
                <p>
                  Berlaku sampai:{' '}
                  {new Date(disc.expiredAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        )}

        {user?.role === Role.CUSTOMERS && (
          <div className="flex gap-6 items-center mt-4">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button
                onClick={() => setQty((prev) => prev + 1)}
                className="px-4 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <div className="text-lg font-bold">
              {priceAfterDiscount > 0 ? (
                <>
                  <span className="line-through text-gray-400 mr-2 text-sm">
                    Rp. {(Number(price) * qty).toLocaleString('id-ID')}
                  </span>
                  <span className="text-primary">
                    Rp.{' '}
                    {(Number(priceAfterDiscount) * qty).toLocaleString('id-ID')}
                  </span>
                </>
              ) : (
                <span>Rp. {total.toLocaleString('id-ID')}</span>
              )}
            </div>
          </div>
        )}

        {user?.role === Role.CUSTOMERS && (
          <button
            onClick={addToCartHandler}
            className="mt-4 w-full bg-primary text-white py-3 rounded-md hover:scale-105 transition-all font-semibold"
          >
            MASUKKAN KE KERANJANG
          </button>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-tertiary">
            Kategori Produk
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {product.CategoryProduct.map((cp, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-quaternary hover:bg-tertiary hover:text-white transition-colors"
              >
                <p className="font-bold text-tertiary">{cp.Category.name}</p>
                <p className="text-sm text-gray-700">
                  {
                    (cp.Category as { name: string; description: string })
                      .description
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
