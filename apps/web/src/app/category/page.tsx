'use client';

import { useStoreContext } from '../../utility/StoreContext';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const CategoryPage: React.FC = () => {
  const { categories, loading, error, nearestStore } = useStoreContext();
  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className=" mx-auto px-4 py-8 min-h-screen mt-35">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Discover Our Categories
        </h1>
        <p className="text-lg text-tertiary mt-2">
          Find the best items at {nearestStore?.name}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <div key={category.id}>
            <Link href={`/category/${nearestStore?.slug}/${category.slug}`}>
              <div className="bg-white rounded-lg shadow-md relative overflow-hidden h-64 flex items-center justify-center transition-all duration-300 hover:scale-105">
                {category.image && (
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="opacity-95"
                    />
                  </div>
                )}
                <div className="z-10">
                  <h2
                    className="text-2xl font-semibold text-center text-white bg-black px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    {category.name}
                  </h2>
                </div>
              </div>
            </Link>
            <div className="mt-4 px-2">
              <p className="text-black">{category.excerpt || '-'}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryPage;
