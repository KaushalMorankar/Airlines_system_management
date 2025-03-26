"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch current user info on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo (left) */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">✈</span>
          <h2 className="text-xl font-bold text-white">Airlines</h2>
        </div>

        {/* Navigation + Search (right) */}
        <nav className="flex items-center space-x-8">
          <Link href="/" legacyBehavior>
            <a className="text-blue-200 font-semibold">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="text-gray-400 hover:text-blue-600 transition">About</a>
          </Link>
          <Link href="/services" legacyBehavior>
            <a className="text-gray-400 hover:text-blue-600 transition">Services</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="text-gray-400 hover:text-blue-600 transition">Contact</a>
          </Link>
          {user ? (
            <>
              <span className="text-gray-400">Hello, {user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transform hover:scale-110 transition duration-200 ease-in-out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register" legacyBehavior>
                <a className="text-gray-400 hover:text-blue-600 transition">
                  Register
                </a>
              </Link>
              <Link href="/login" legacyBehavior>
                <a className="text-gray-400 hover:text-blue-600 transition">
                  Login
                </a>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
