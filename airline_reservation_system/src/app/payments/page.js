// "use client";
// import { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// export default function PaymentsPage() {
//   const searchParams = useSearchParams();
//   const flightId = searchParams.get("flightId");
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/reservations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ flightId }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.error || "Booking failed");
//       } else {
//         // On success, redirect to a confirmation page
//         router.push("/confirmation");
//       }
//     } catch (err) {
//       console.error("Error processing booking", err);
//       setError("An error occurred while processing booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold mb-4">Confirm Your Booking</h1>
//       {flightId ? (
//         <form onSubmit={handlePayment} className="bg-white p-6 rounded shadow-md w-full max-w-md">
//           <p className="mb-4">You are booking flight ID: {flightId}</p>
//           {/* 
//               Optionally, you can add payment details fields here (e.g. card info).
//               For simplicity, we assume confirmation means booking the flight.
//           */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             {loading ? "Processing..." : "Confirm Booking"}
//           </button>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//         </form>
//       ) : (
//         <p>No flight selected.</p>
//       )}
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; // Adjust the path if needed

export default function Payments() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId");
  const seatIdsParam = searchParams.get("seatIds"); // comma-separated list
  const seatAllocationIds = seatIdsParam
    ? seatIdsParam.split(",").map(Number)
    : [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservationId, setReservationId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [seatDetails, setSeatDetails] = useState([]);
  const router = useRouter();

  // Check login status via the API endpoint.
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (err) {
        console.error("Error checking login status", err);
        setIsLoggedIn(false);
      }
    }
    checkLoginStatus();
  }, []);

  // Fetch seat details to obtain seat numbers.
  useEffect(() => {
    if (!flightId) return;
    async function fetchSeatDetails() {
      try {
        const res = await fetch(
          `/api/seats?flightId=${encodeURIComponent(flightId)}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error fetching seat details");
        } else {
          setSeatDetails(data.seats);
        }
      } catch (err) {
        console.error("Error fetching seat details:", err);
        setError("Failed to fetch seat details.");
      }
    }
    fetchSeatDetails();
  }, [flightId]);

  // Fetch pricing details when flightId or seatAllocationIds change.
  useEffect(() => {
    async function fetchPrice() {
      if (flightId && seatAllocationIds.length > 0) {
        try {
          const res = await fetch(
            `/api/payments?flightId=${flightId}&seatIds=${seatAllocationIds.join(
              ","
            )}`
          );
          const data = await res.json();
          if (res.ok) {
            setTotalPrice(data.totalPrice);
          } else {
            setError(data.error || "Failed to fetch price");
          }
        } catch (error) {
          console.error("Error fetching price:", error);
          setError("Error fetching price");
        }
      }
    }
    fetchPrice();
  }, [flightId, seatAllocationIds]);

  // Handle the payment process.
  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      // For simplicity, we assume user_id is 1.
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId,
          seatAllocationIds,
          userId: 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment failed");
      } else {
        setReservationId(data.reservationId);
        setTotalPrice(data.totalPrice);
      }
    } catch (err) {
      console.error("Error processing payment", err);
      setError("Payment processing error");
    } finally {
      setLoading(false);
    }
  };

  // Map selected seat IDs to their corresponding seat numbers.
  const selectedSeatNumbers = seatDetails
    .filter((seat) => seatAllocationIds.includes(seat.seat_allocation_id))
    .map((seat) => seat.seatnumber);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">Payment Page</h1>
        <p>Flight ID: {flightId}</p>
        <p>
          Selected Seats:{" "}
          {selectedSeatNumbers.length > 0
            ? selectedSeatNumbers.join(", ")
            : "Loading..."}
        </p>
        <p>
          Total Price:{" "}
          {totalPrice ? `$${totalPrice.toFixed(2)}` : "Calculating..."}
        </p>
        {reservationId ? (
          <div>
            <p className="text-green-600">Payment successful!</p>
            <p>Reservation ID: {reservationId}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {isLoggedIn ? (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Login to Pay
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

