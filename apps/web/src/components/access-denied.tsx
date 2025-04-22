import Image from 'next/image';

export default function AccessDenied() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/path/to/your/image.jpg')" }}
    >
      <div className="bg-opacity-50 p-10 rounded-lg text-center text-black shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg mb-6">
          You dont have permission to access this page.
        </p>
        <div className="flex justify-center">
          <Image
            src="https://i.pinimg.com/1200x/02/fb/75/02fb75577aaa59c8bff916d71b1b94d1.jpg"
            alt="Access Denied"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  );
}
