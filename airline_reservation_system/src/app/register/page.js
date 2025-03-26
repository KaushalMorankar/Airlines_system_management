"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage("Failed to register user.");
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative">

            {/* Layered background gradient shapes (optional) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {/* Example gradient blobs or shapes can be placed here */}
              <div className="absolute w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 -top-20 -left-40" />
              <div className="absolute w-80 h-80 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-3xl opacity-30 bottom-0 -right-20" />
            </div>

            {/* Registration Form Card */}
            <div className="relative z-10 w-full md:w-1/2 max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
              <h1 className="text-3xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                Welcome Aboard
              </h1>
              <p className="text-center text-sm text-gray-300 mb-6">
                Register now and embark on your journey!
              </p>

              {message && (
                <div className="mb-4 text-center">
                  <p className="text-red-400 font-semibold">{message}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    id="phone_number"
                    placeholder="+91 5665656556"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="123 Main St, City, Country"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 hover:to-pink-500 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                >
                  Sign Up
                </button>
              </form>

              {/* Social Sign-Up
              <div className="mt-6">
                <p className="text-center text-gray-400 text-sm mb-3">
                  Or sign up with
                </p>
                <div className="flex gap-2 justify-center">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm transition">
                    <img src="/google-icon.svg" alt="Google" className="w-4 h-4" />
                    Google
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white text-sm transition">
                    <img
                      src="/facebook-icon.svg"
                      alt="Facebook"
                      className="w-4 h-4"
                    />
                    Facebook
                  </button>
                </div>
              </div> */}

              {/* Already have account */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-pink-400 hover:underline transition"
                  >
                    Login here
                  </a>
                </p>
              </div>
            </div>

            {/* Testimonial / Additional Info Card */}
            <div className="relative z-10 w-full md:w-1/2 p-8 mt-8 md:mt-0 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 max-w-md">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                What's Our Travelers Say?
              </h2>
              <p className="text-sm text-gray-300 mb-6">
                “I had an amazing experience! The process was so smooth and the
                support was incredible.”
              </p>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/avatar1.jpeg"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold text-sm">Jane Smith</p>
                  <p className="text-gray-400 text-xs">Frequent Flyer</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                “Sky Nova Airlines made my dream vacation a reality. I highly
                recommend signing up!”
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img
                  src="/avatar2.jpeg"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold text-sm">Jenny Ann</p>
                  <p className="text-gray-400 text-xs">World Explorer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}




// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     address: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const router = useRouter();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setMessage("");

//     try {
//       const response = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         // Registration successful: redirect to Home (user is now logged in)
//         router.push("/");
//       } else {
//         // If user already exists or another error occurred, show the message
//         setMessage(data.message);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setMessage("Failed to register user.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="p-6 bg-white shadow-lg rounded-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Register</h2>
//         <form onSubmit={handleRegister}>
//           <input
//             type="text"
//             name="full_name"
//             placeholder="Full Name"
//             value={formData.full_name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-2"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-2"
//           />
//           <input
//             type="text"
//             name="phone_number"
//             placeholder="Phone Number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-2"
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={formData.address}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-2"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-2"
//           />
//           <button className="w-full bg-green-500 text-white p-2 rounded">
//             Register
//           </button>
//         </form>
//         {message && <p className="mt-2 text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// }