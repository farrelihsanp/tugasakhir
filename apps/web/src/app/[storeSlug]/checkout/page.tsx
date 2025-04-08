'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const ShippingCostCalculator = () => {
  const { storeSlug } = useParams();

  const [shippingCost, setShippingCost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeSlug) {
      setError('Store slug is required');
      return;
    }

    const fetchShippingCost = async () => {
      setLoading(true);
      setError(null);
      setShippingCost(null);

      try {
        // Mendapatkan data dari API backend untuk menghitung biaya pengiriman
        const response = await fetch(
          `http://localhost:8000/api/v1/shipping-cost/calculate/${storeSlug}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch shipping cost');
        }

        const data = await response.json();

        if (data.ok) {
          setShippingCost(data.data); // Menyimpan data biaya pengiriman
        } else {
          setError('Could not calculate shipping cost');
        }
      } catch (error: unknown) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingCost();
  }, [storeSlug]); // Fetch ulang jika storeSlug berubah

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">
          Shipping Cost Calculator
        </h2>

        {loading ? (
          <p className="text-center">Calculating...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : shippingCost ? (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Shipping Cost</h3>
            <div className="mt-2 bg-gray-100 p-4 rounded-md">
              {shippingCost.map((cost: any, index: number) => (
                <div key={index} className="mb-2">
                  <p>
                    <strong>Courier:</strong> {cost.courier}
                  </p>
                  <p>
                    <strong>Cost:</strong> {cost.cost}
                  </p>
                  <p>
                    <strong>Estimated Delivery:</strong> {cost.etd}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No shipping cost data available.</p>
        )}
      </div>
    </section>
  );
};

export default ShippingCostCalculator;
