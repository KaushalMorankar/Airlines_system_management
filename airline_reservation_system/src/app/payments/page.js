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
import Navbar from "@/components/Navbar";

export default function Payments() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId");
  const seatIdsParam = searchParams.get("seatIds"); // comma-separated list of seat allocation IDs
  const priceParam = searchParams.get("price");
  const seatAllocationIds = seatIdsParam
    ? seatIdsParam.split(",").map(Number)
    : [];
  const totalPrice = priceParam ? parseFloat(priceParam) : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservationId, setReservationId] = useState(null);
  const [seatDetails, setSeatDetails] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // 1. Check login status
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

  // 2. Fetch seat details to retrieve seat numbers.
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

  // 3. Pre-populate passengerDetails with the seat numbers.
  useEffect(() => {
    if (seatDetails.length > 0 && seatAllocationIds.length > 0) {
      const selectedSeats = seatDetails.filter((seat) =>
        seatAllocationIds.includes(seat.seat_allocation_id)
      );
      if (passengerDetails.length === 0) {
        const initialDetails = selectedSeats.map((seat) => ({
          full_name: "",
          passport_number: "",
          date_of_birth: "",
          seat_number: seat.seatnumber,
        }));
        setPassengerDetails(initialDetails);
      }
    }
  }, [seatDetails, seatAllocationIds, passengerDetails]);

  // Handle form field changes
  const handlePassengerChange = (index, field, value) => {
    const newDetails = [...passengerDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setPassengerDetails(newDetails);
  };

  // 4. Payment process + storing passenger details
  const handlePayment = async () => {
    // Validate passenger fields
    for (let i = 0; i < passengerDetails.length; i++) {
      const { full_name, passport_number, date_of_birth, seat_number } =
        passengerDetails[i];
      if (!full_name || !passport_number || !date_of_birth || !seat_number) {
        setError(
          `Please fill out all details for the passenger for seat number ${passengerDetails[i].seat_number}`
        );
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      // (A) Process payment
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightId,
          seatAllocationIds,
          totalPrice,
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        setError(paymentData.error || "Payment failed");
        setLoading(false);
        return;
      }

      // (B) If payment is successful, store passenger details
      const newReservationId = paymentData.reservationId;
      setReservationId(newReservationId);

      const passengersRes = await fetch("/api/passangers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: newReservationId,
          passengers: passengerDetails,
        }),
      });
      const passengersData = await passengersRes.json();
      if (!passengersRes.ok) {
        setError(passengersData.error || "Error storing passenger details");
        setLoading(false);
        return;
      }

      // (C) Done! We set reservationId, which triggers the success UI.
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Payment processing error");
    } finally {
      setLoading(false);
    }
  };

  // 5. Once reservationId is set, show a success page.
  if (reservationId) {
    // Gather seat numbers from passengerDetails
    const selectedSeatNumbers = passengerDetails
      .map((p) => p.seat_number)
      .join(", ");

    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-4">Payment Page</h1>
          <p>Flight ID: {flightId}</p>
          <p>Selected Seats: {selectedSeatNumbers}</p>
          <p>Total Price: ${totalPrice?.toFixed(2)}</p>
          <p className="text-green-600 mt-2">Payment successful!</p>
          <p>Reservation ID: {reservationId}</p>
          <p>Total Price: ${totalPrice?.toFixed(2)}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // 6. Otherwise, show the payment form
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">Payment & Passenger Details</h1>
        <p>Flight ID: {flightId}</p>
        <p>
          Total Price:{" "}
          {totalPrice ? `$${totalPrice.toFixed(2)}` : "Calculating..."}
        </p>

        {/* Passenger Details Form */}
        <div className="w-full max-w-xl mt-6">
          <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
          {passengerDetails.length > 0 ? (
            passengerDetails.map((passenger, index) => (
              <div key={index} className="mb-4 border p-4 rounded">
                <h3 className="font-semibold mb-2">
                  Seat Number: {passenger.seat_number}
                </h3>
                <div className="mb-2">
                  <label className="block mb-1">Full Name:</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={passenger.full_name}
                    onChange={(e) =>
                      handlePassengerChange(index, "full_name", e.target.value)
                    }
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Passport Number:</label>
                  <input
                    type="text"
                    placeholder="Enter passport number"
                    value={passenger.passport_number}
                    onChange={(e) =>
                      handlePassengerChange(
                        index,
                        "passport_number",
                        e.target.value
                      )
                    }
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={passenger.date_of_birth}
                    onChange={(e) =>
                      handlePassengerChange(
                        index,
                        "date_of_birth",
                        e.target.value
                      )
                    }
                    className="border p-2 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Seat Number:</label>
                  <input
                    type="text"
                    value={passenger.seat_number}
                    disabled
                    className="border p-2 w-full bg-gray-200"
                  />
                </div>
              </div>
            ))
          ) : (
            <p>Loading seat details...</p>
          )}
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        {isLoggedIn ? (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="mt-6 bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Login to Pay
          </button>
        )}
      </div>
    </div>
  );
}
