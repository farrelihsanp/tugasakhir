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
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }
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
          if (!res.ok) {
            throw new Error(data.error || 'Failed to fetch discount');
          }
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
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center font-medium">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!productData) {
    return <div className="p-6 text-center font-medium">Product not found</div>;
  }

  const { product, price, priceAfterDiscount, stock } = productData;
  const effectivePrice = priceAfterDiscount > 0 ? priceAfterDiscount : price;
  const total = Number(effectivePrice) * qty;

  const addToCartHandler = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/cart/add/${storeSlug}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            productId: product.id,
            quantity: qty,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success('Product added to cart successfully!');
      } else {
        throw new Error(data.error || 'Failed to add product to cart');
      }
    } catch (err: unknown) {
      toast.error(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">DETAIL PRODUCT</h1>
      <h2 className="text-2xl font-semibold mb-6">{product.name}</h2>

      {/* Images */}
      <div className="flex flex-col items-center gap-4">
        {product.ProductImages[0] && (
          <Image
            src={product.ProductImages[0].imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-md object-cover"
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
              className="rounded-md object-cover"
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="mt-6 text-sm text-gray-600 leading-relaxed">
        {product.description}
      </p>

      {/* Product Info */}
      <div className="text-left mt-6 space-y-1">
        <p>
          <span className="font-medium">Produk</span>: {product.name}
        </p>
        <p>
          <span className="font-medium">Harga</span>:{' '}
          {priceAfterDiscount > 0 ? (
            <>
              <span className="line-through text-gray-500 mr-2">
                Rp. {Number(price).toLocaleString('id-ID')}
              </span>
              <span className="text-red-600 font-semibold">
                Rp. {Number(priceAfterDiscount).toLocaleString('id-ID')}
              </span>
            </>
          ) : (
            <span>Rp. {Number(price).toLocaleString('id-ID')}</span>
          )}
        </p>
        <p>
          <span className="font-medium">Stock</span>: {stock} items
        </p>
        <p>
          <span className="font-medium">Berat</span>: {product.weight} gram
        </p>
      </div>

      {/* Diskon */}
      {discountData.length > 0 && (
        <div className="mt-4 text-left bg-yellow-100 p-4 rounded-md border border-yellow-300">
          <h3 className="font-bold text-yellow-800 mb-2">Diskon Tersedia</h3>
          {discountData.map((disc, idx) => (
            <div key={idx} className="text-sm text-yellow-900">
              <p>
                <strong>{disc.name}</strong>
              </p>
              <p>Jenis Diskon: {disc.type}</p>
              <p>Minimum Pembelian: {disc.minPurchase}</p>
              <p>Maksimum Diskon: {disc.maxDiscount}</p>
              <p>
                Berlaku hingga:{' '}
                {new Date(disc.expiredAt).toLocaleDateString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quantity Selector & Total */}
      {user?.role === Role.CUSTOMERS && (
        <div className="flex items-center justify-center mt-6 gap-8">
          <div className="flex items-center gap-4 text-lg font-semibold">
            <button
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              className="w-10 h-10 rounded-full border text-xl"
            >
              -
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((prev) => prev + 1)}
              className="w-10 h-10 rounded-full border text-xl"
            >
              +
            </button>
          </div>
          <div className="text-xl font-bold">
            {priceAfterDiscount > 0 ? (
              <>
                <span className="line-through text-gray-500 mr-2 text-lg">
                  Rp. {(Number(price) * qty).toLocaleString('id-ID')}
                </span>
                <span className="text-red-600">
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

      {/* Add to Cart */}
      {user?.role === Role.CUSTOMERS && (
        <button
          onClick={addToCartHandler}
          className="mt-6 border border-black px-6 py-3 font-semibold hover:bg-black hover:text-white transition"
        >
          MASUKAN KE KERANJANG
        </button>
      )}

      {/* Category Info */}
      <div className="mt-10 text-left">
        <h3 className="text-lg font-semibold mb-2">Kategori Produk</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.CategoryProduct.map((cp, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <p className="font-bold">{cp.Category.name}</p>
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
  );
}
