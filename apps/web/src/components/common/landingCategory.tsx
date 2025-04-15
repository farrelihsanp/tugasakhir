'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useStoreContext } from '@/utility/StoreContext';

export default function LandingCategory() {
  const { categories } = useStoreContext();

  return (
    <section>
      <div className="mt-5 mx-auto px-5">
        <div>
          <h1 className="text-2xl font-bold">Category:</h1>
        </div>
        <div className="flex flex-wrap justify-center items-center mx-auto mt-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="m-5 flex flex-col items-center justify-center"
            >
              <Link href="#">
                <div className="relative h-16 w-16">
                  <Image
                    src={category.Image}
                    alt={category.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </Link>
              <div>
                <p className="text-bold text-center mt-2">{category.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
