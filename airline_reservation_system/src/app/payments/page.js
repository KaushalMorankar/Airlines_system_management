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
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Payments() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId");
  const seatIdsParam = searchParams.get("seatIds"); // comma-separated list
  const seatAllocationIds = seatIdsParam
    ? seatIdsParam.split(",").map((id) => parseInt(id))
    : [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservationId, setReservationId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const router = useRouter();

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
      setError("Payment processing error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Payment Page</h1>
      <p>Flight ID: {flightId}</p>
      <p>Selected Seat IDs: {seatAllocationIds.join(", ")}</p>
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
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
}
