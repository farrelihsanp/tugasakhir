'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStoreContext } from '@/utility/StoreContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function LandingCategory() {
  const { categories, nearestStore } = useStoreContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = 350;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mt-10 ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-0 mb-4">
        <h1 className="text-2xl font-bold">Featured Categories</h1>
        <div className="space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Scrollable Categories */}
      <div className="flex justify-center">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 pb-4 scroll-smooth snap-x snap-mandatory"
        >
          {categories.map((category, index) => (
            <div key={index} className="flex-none w-[400px] snap-start">
              <Link
                href={`/category/${nearestStore?.slug}/${category.slug}`}
                className="block relative h-60 rounded-lg overflow-hidden group shadow-lg"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center">
                  <h2 className="text-white text-xl md:text-2xl font-semibold text-center px-4">
                    {category.name}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
