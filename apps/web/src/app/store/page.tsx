'use client';

import React from 'react';
import { useStoreContext } from '../../utility/StoreContext';

const NearestStorePage = () => {
  const { nearestStore, products, cheapProducts, loading, error } =
    useStoreContext();

  if (loading) return <p>Loading store data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nearest Store Information</h1>

      {nearestStore ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{nearestStore.name}</h2>
          <p className="text-gray-600">{nearestStore.address}</p>
        </div>
      ) : (
        <p>No store selected.</p>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold">Cheap Products</h3>
        {cheapProducts.length > 0 ? (
          <ul className="list-disc ml-6">
            {cheapProducts.map((product) => (
              <li key={product.id}>
                {product.name} - Rp{product.price.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No cheap products found.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold">All Products</h3>
        {products.length > 0 ? (
          <ul className="list-disc ml-6">
            {products.map((product) => (
              <li key={product.id}>
                {product.name} - Rp{product.price.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default NearestStorePage;
