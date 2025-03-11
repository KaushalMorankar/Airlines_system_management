"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar"; // Ensure the path is correct

export default function ConfirmationPage() {
  return (
    <div>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="mb-4">Your flight has been successfully booked.</p>
      <Link href="/" legacyBehavior>
        <a className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
          Go to Home
        </a>
      </Link>
    </div>
    </div>
  );
}
