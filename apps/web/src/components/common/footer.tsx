import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-color-lagoon text-gray-700 pt-10 pb-6 px-4 mt-12">
      {/* Grid Konten Utama */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-1">
            <li>Vegetables & Fruits</li>
            <li>Breakfast & instant food</li>
            <li>Bakery & Biscuits</li>
            <li>Atta, rice & dal</li>
            <li>Sauces & spreads</li>
            <li>Organic & gourmet</li>
            <li>Baby care</li>
            <li>Cleaning essentials</li>
            <li>Personal care</li>
          </ul>
        </div>

        <div>
          <ul className="mt-8 md:mt-0 space-y-1">
            <li>Dairy, bread & eggs</li>
            <li>Cold drinks & juices</li>
            <li>Tea, coffee & drinks</li>
            <li>Masala, oil & more</li>
            <li>Chicken, meat & fish</li>
            <li>Paan corner</li>
            <li>Pharma & wellness</li>
            <li>Home & office</li>
            <li>Pet care</li>
          </ul>
        </div>

        {/* Get to know us */}
        <div>
          <h3 className="font-semibold mb-3">Get to know us</h3>
          <ul className="space-y-1">
            <li>Company</li>
            <li>About</li>
            <li>Blog</li>
            <li>Help Center</li>
            <li>Our Value</li>
          </ul>
        </div>

        {/* For Consumers */}
        <div>
          <h3 className="font-semibold mb-3">For Consumers</h3>
          <ul className="space-y-1">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Product Returns</li>
            <li>FAQ</li>
            <li>Shop Checkout</li>
          </ul>

          <h3 className="font-semibold mt-6 mb-3">Become a Shopper</h3>
          <ul className="space-y-1">
            <li>Shopper Opportunities</li>
            <li>Become a Shopper</li>
            <li>Earnings</li>
            <li>Ideas & Guides</li>
            <li>New Retailers</li>
          </ul>
        </div>

        {/* Quickmart Programs */}
        <div>
          <h3 className="font-semibold mb-3">Quickmart programs</h3>
          <ul className="space-y-1">
            <li>Freshcart programs</li>
            <li>Gift Cards</li>
            <li>Promos & Coupons</li>
            <li>Freshcart Ads</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>

      {/* Payment & App */}
      <div className="max-w-7xl mx-auto mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500 text-center md:text-left">
          © 2025 Quickmart eCommerce. Powered by{' '}
          <a
            className="text-green-600"
            href="farrel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Farrel
          </a>
          .
        </div>

        <div className="w-96 flex flex-wrap justify-center items-center gap-3">
          {[
            [
              'Amazon Pay',
              'https://res.cloudinary.com/dm1cnsldc/image/upload/v1745028464/AMAZON_PAY_rvokl1.jpg',
            ],
            [
              'Mandiri',
              'https://res.cloudinary.com/dm1cnsldc/image/upload/v1745028465/MANDIRI_xyg5ff.jpg',
            ],
            [
              'BCA',
              'https://res.cloudinary.com/dm1cnsldc/image/upload/v1745028466/BCA-removebg-preview_gkemf7.png',
            ],
            [
              'BRI',
              'https://res.cloudinary.com/dm1cnsldc/image/upload/v1745028985/BRI-removebg-preview_fssaza.png',
            ],
            [
              'BSI',
              'https://res.cloudinary.com/dm1cnsldc/image/upload/v1745028465/BSI_cabj4p.png',
            ],
          ].map(([alt, src]) => (
            <div
              key={alt}
              className="relative w-[100px] h-[50px] overflow-hidden rounded"
            >
              <Image src={src} alt={alt} layout="fill" objectFit="cover" />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2">
          <Image
            src="https://res.cloudinary.com/dm1cnsldc/image/upload/v1745028236/APP_STORE_up3o18.png"
            alt="App Store"
            width={100}
            height={36}
          />
          <Image
            src="https://res.cloudinary.com/dm1cnsldc/image/upload/v1745028237/GOOGLE_PLAY_oiykxq.png"
            alt="Google Play"
            width={100}
            height={36}
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="max-w-7xl mx-auto mt-6 text-center md:text-right">
        <p className="text-sm text-gray-500">Follow us on</p>
        <div className="flex justify-center md:justify-end gap-2 mt-2">
          <FaFacebook />
          <FaInstagram />
          <FaTwitter />
        </div>
      </div>
    </footer>
  );
}
