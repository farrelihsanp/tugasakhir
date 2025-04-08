import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <section>
      <div className="bg-blue-600 py-3">
        <div className="flex items-center justify-center">
          <div>
            <Link href="#">
              <Image
                src="https://res.cloudinary.com/dm1cnsldc/image/upload/v1741129248/LOGO-NEW_ylnnp9.png"
                width={200}
                height={200}
                alt="Landing Page Photo"
                className="w-20 h-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
