'use client';

import { useStoreContext } from '../../utility/StoreContext';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const CategoryPage: React.FC = () => {
  const { categories, loading, error, nearestStore } = useStoreContext();

  // console.log('nearestStore isinya :', nearestStore);
  // console.log('categories isinya :', categories);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link
            href={`/category/${nearestStore?.slug}/${category.slug}`}
            key={category.id}
            className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 block"
          >
            {category.image && (
              <Image
                src={category.image}
                alt={category.name}
                width={500}
                height={500}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
