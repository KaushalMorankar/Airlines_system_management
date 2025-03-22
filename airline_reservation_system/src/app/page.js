import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar"; // Ensure the path is correct

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ---------- HEADER ---------- */}
      <Navbar />

      {/* ---------- HERO SECTION ---------- */}
      <section className="relative flex-grow overflow-hidden">
        {/* Diagonal blue shape on the right */}
        <div
          className="hidden md:block absolute top-0 right-0 w-1/2 h-full bg-blue-500"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 100%)" }}
        />

        {/* Optional faint world map (centered behind the text) */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <img src="/map.png" alt="World Map" className="w-2/3 opacity-75" />
        </div>

        {/* Content container */}
        <div className="relative max-w-7xl mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center justify-between">
          {/* Left side: Text content */}
          <div className="max-w-lg md:w-1/2 mt-8 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Hi, <span className="text-blue-600">where</span> would you like to go?
            </h1>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean placerat nisl quis convallis ullamcorper.
            </p>
            {/* Buttons wrapped with Link */}
            <div className="flex gap-4">
              <Link href="/flights" legacyBehavior>
                <a>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                    Book Now
                  </button>
                </a>
              </Link>
              <Link href="/bookings" legacyBehavior>
                <a>
                  <button className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition">
                    My Bookings
                  </button>
                </a>
              </Link>
            </div>
          </div>

          {/* Right side: Airplane image */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <img
              src="/Aerodynamics-removebg-preview.png"
              alt="Airplane"
              className="w-full max-w-sm"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
