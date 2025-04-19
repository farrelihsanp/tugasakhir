// app/page.tsx
'use client';

import { FaClock, FaGift, FaBoxes, FaUndo } from 'react-icons/fa';

export default function ServicePage() {
  return (
    <section className="bg-white text-gray-800 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Item 1 */}
        <div className="flex flex-col items-start gap-3">
          <FaClock className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-lg">10 minute grocery now</h3>
          <p className="text-sm text-gray-600">
            Get your order delivered to your doorstep at the earliest from
            FreshCart pickup stores near you.
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-start gap-3">
          <FaGift className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-lg">Best Prices & Offers</h3>
          <p className="text-sm text-gray-600">
            Cheaper prices than your local supermarket, great cashback offers to
            top it off. Get best prices & offers.
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-start gap-3">
          <FaBoxes className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-lg">Wide Assortment</h3>
          <p className="text-sm text-gray-600">
            Choose from 5000+ products across food, personal care, household,
            bakery, veg and non-veg & other categories.
          </p>
        </div>

        {/* Item 4 */}
        <div className="flex flex-col items-start gap-3">
          <FaUndo className="text-green-600 text-3xl" />
          <h3 className="font-semibold text-lg">Easy Returns</h3>
          <p className="text-sm text-gray-600">
            Not satisfied with a product? Return it at the doorstep & get a
            refund within hours. No questions asked{' '}
            <span className="text-green-600 font-medium">policy</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
