"use client";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img src="/error.jpg" alt="error" className="w-50 h-50" />
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <Link href="/">
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
