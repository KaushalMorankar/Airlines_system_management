"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Login failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative">
            {/* Optional Layered Background Gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 -top-20 -left-40" />
              <div className="absolute w-80 h-80 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl opacity-30 bottom-0 -right-20" />
            </div>

            {/* Login Form Card */}
            <div className="relative z-10 w-full md:w-1/2 max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 flex flex-col">
              <h1 className="text-3xl font-extrabold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                Sky Nova Airlines
              </h1>
              <h2 className="text-2xl font-bold text-center mb-6">
                Login
              </h2>

              {error && (
                <div className="mb-4 text-center">
                  <p className="text-red-400 font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-gradient-to-r from-pink-500 to-purple-600 hover:to-pink-500 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                >
                  Login
                </button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  New to our service?{" "}
                  <a
                    href="/register"
                    className="text-pink-400 hover:underline transition"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>

            {/* Promotional Info Card */}
            <div className="relative z-10 w-full md:w-1/2 max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                Welcome Back!
              </h2>
              <p className="text-sm text-gray-300 mb-6">
                We're excited to have you back on board. Enjoy exclusive deals,
                priority support, and seamless travel experiences with Sky Nova
                Airlines.
              </p>
              <img
                src="/singapore.jpeg"  // Replace with an appropriate promotional image
                alt="Promotional"
                className="w-full object-contain rounded-md"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         credentials: "include", // ensures cookies are handled
//       });

//       if (res.ok) {
//         // Login successful, redirect to home page
//         router.push("/");
//       } else {
//         const data = await res.json();
//         setError(data.message || "Login failed");
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-full max-w-md"
//       >
//         <h1 className="text-xl font-bold mb-4">Login</h1>
//         {error && <p className="text-red-600 mb-4">{error}</p>}
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Email:</label>
//           <input
//             type="email"
//             className="w-full border p-2 rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-1">Password:</label>
//           <input
//             type="password"
//             className="w-full border p-2 rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }


// // "use client";
// // import { useState } from "react";
// // import { useRouter } from "next/navigation";
// // import { initializeApp } from "firebase/app";
// // import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// // // Replace with your actual Firebase config
// // const firebaseConfig = {

// // };

// // const app = initializeApp(firebaseConfig);
// // const auth = getAuth(app);

// // export default function LoginForm() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const router = useRouter();

// //   const handleEmailLogin = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     try {
// //       // Authenticate using Firebase with Email/Password
// //       const userCredential = await signInWithEmailAndPassword(auth, email, password);
// //       // Optionally trigger your backend API to send a login email
// //       await fetch("/api/send-login-email", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email }),
// //       });
// //       router.push("/");
// //     } catch (err) {
// //       console.error("Email login error:", err);
// //       setError("Login failed: " + err.message);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
// //       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
// //         <h1 className="text-xl font-bold mb-4">Login</h1>
// //         {error && <p className="text-red-600 mb-4">{error}</p>}

// //         {/* Email/Password Login Form */}
// //         <form onSubmit={handleEmailLogin}>
// //           <div className="mb-4">
// //             <label className="block text-gray-700 mb-1">Email:</label>
// //             <input
// //               type="email"
// //               className="w-full border p-2 rounded"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               placeholder="Enter your email"
// //               required
// //             />
// //           </div>
// //           <div className="mb-4">
// //             <label className="block text-gray-700 mb-1">Password:</label>
// //             <input
// //               type="password"
// //               className="w-full border p-2 rounded"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               placeholder="Enter your password"
// //               required
// //             />
// //           </div>
// //           <button
// //             type="submit"
// //             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
// //           >
// //             Login
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }











// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// // Replace with your actual Firebase config
// const firebaseConfig = {

// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export default function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleEmailLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       // Authenticate using Firebase with Email/Password
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       // Optionally trigger your backend API to send a login email
//       await fetch("/api/send-login-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       router.push("/");
//     } catch (err) {
//       console.error("Email login error:", err);
//       setError("Login failed: " + err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h1 className="text-xl font-bold mb-4">Login</h1>
//         {error && <p className="text-red-600 mb-4">{error}</p>}

//         {/* Email/Password Login Form */}
//         <form onSubmit={handleEmailLogin}>
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-1">Email:</label>
//             <input
//               type="email"
//               className="w-full border p-2 rounded"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-1">Password:</label>
//             <input
//               type="password"
//               className="w-full border p-2 rounded"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
