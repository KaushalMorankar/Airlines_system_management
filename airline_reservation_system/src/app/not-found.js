// src/app/not-found.js
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 relative">
          {/* Layered background gradient shapes */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 -top-20 -left-40" />
            <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 bottom-0 -right-20" />
          </div>

          {/* Not Found Message Card */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8 max-w-md mx-auto">
            <h1 className="text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              404
            </h1>
            <h2 className="text-2xl font-bold text-center mb-2">
              Page Not Found
            </h2>
            <p className="text-center text-sm text-gray-300 mb-6">
              Oops! The page you're looking for doesn't exist. It might be under construction or moved.
            </p>
            <a 
              href="/" 
              className="w-full py-3 px-6 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 hover:to-pink-500 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition text-center"
            >
              Go Back Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
