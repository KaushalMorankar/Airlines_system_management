// // "use client";
// // import { useState } from "react";
// // import { useSearchParams, useRouter } from "next/navigation";

// // export default function PaymentsPage() {
// //   const searchParams = useSearchParams();
// //   const flightId = searchParams.get("flightId");
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handlePayment = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const res = await fetch("/api/reservations", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ flightId }),
// //       });
// //       const data = await res.json();
// //       if (!res.ok) {
// //         setError(data.error || "Booking failed");
// //       } else {
// //         // On success, redirect to a confirmation page
// //         router.push("/confirmation");
// //       }
// //     } catch (err) {
// //       console.error("Error processing booking", err);
// //       setError("An error occurred while processing booking");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
// //       <h1 className="text-3xl font-bold mb-4">Confirm Your Booking</h1>
// //       {flightId ? (
// //         <form onSubmit={handlePayment} className="bg-white p-6 rounded shadow-md w-full max-w-md">
// //           <p className="mb-4">You are booking flight ID: {flightId}</p>
// //           {/* 
// //               Optionally, you can add payment details fields here (e.g. card info).
// //               For simplicity, we assume confirmation means booking the flight.
// //           */}
// //           <button
// //             type="submit"
// //             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
// //           >
// //             {loading ? "Processing..." : "Confirm Booking"}
// //           </button>
// //           {error && <p className="text-red-500 mt-2">{error}</p>}
// //         </form>
// //       ) : (
// //         <p>No flight selected.</p>
// //       )}
// //     </div>
// //   );
// // }



// "use client";
// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";

// export default function Payments() {
//   const searchParams = useSearchParams();
//   const flightId = searchParams.get("flightId");
//   const seatIdsParam = searchParams.get("seatIds"); // comma-separated list of seat allocation IDs
//   const priceParam = searchParams.get("price");
//   const seatAllocationIds = seatIdsParam
//     ? seatIdsParam.split(",").map(Number)
//     : [];
//   const totalPrice = priceParam ? parseFloat(priceParam) : null;

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [reservationId, setReservationId] = useState(null);
//   const [seatDetails, setSeatDetails] = useState([]);
//   const [passengerDetails, setPassengerDetails] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const router = useRouter();

//   // 1. Check login status
//   useEffect(() => {
//     async function checkLoginStatus() {
//       try {
//         const res = await fetch("/api/auth/status");
//         const data = await res.json();
//         setIsLoggedIn(data.isLoggedIn);
//       } catch (err) {
//         console.error("Error checking login status", err);
//         setIsLoggedIn(false);
//       }
//     }
//     checkLoginStatus();
//   }, []);

//   // 2. Fetch seat details to retrieve seat numbers.
//   useEffect(() => {
//     if (!flightId) return;
//     async function fetchSeatDetails() {
//       try {
//         const res = await fetch(
//           `/api/seats?flightId=${encodeURIComponent(flightId)}`
//         );
//         const data = await res.json();
//         if (!res.ok) {
//           setError(data.error || "Error fetching seat details");
//         } else {
//           setSeatDetails(data.seats);
//         }
//       } catch (err) {
//         console.error("Error fetching seat details:", err);
//         setError("Failed to fetch seat details.");
//       }
//     }
//     fetchSeatDetails();
//   }, [flightId]);

//   // 3. Pre-populate passengerDetails with the seat numbers.
//   useEffect(() => {
//     if (seatDetails.length > 0 && seatAllocationIds.length > 0) {
//       const selectedSeats = seatDetails.filter((seat) =>
//         seatAllocationIds.includes(seat.seat_allocation_id)
//       );
//       if (passengerDetails.length === 0) {
//         const initialDetails = selectedSeats.map((seat) => ({
//           full_name: "",
//           passport_number: "",
//           date_of_birth: "",
//           seat_number: seat.seatnumber,
//         }));
//         setPassengerDetails(initialDetails);
//       }
//     }
//   }, [seatDetails, seatAllocationIds, passengerDetails]);

//   // Handle form field changes
//   const handlePassengerChange = (index, field, value) => {
//     const newDetails = [...passengerDetails];
//     newDetails[index] = { ...newDetails[index], [field]: value };
//     setPassengerDetails(newDetails);
//   };

//   // 4. Payment process + storing passenger details
//   const handlePayment = async () => {
//     // Validate passenger fields
//     for (let i = 0; i < passengerDetails.length; i++) {
//       const { full_name, passport_number, date_of_birth, seat_number } =
//         passengerDetails[i];
//       if (!full_name || !passport_number || !date_of_birth || !seat_number) {
//         setError(
//           `Please fill out all details for the passenger for seat number ${passengerDetails[i].seat_number}`
//         );
//         return;
//       }
//     }

//     setLoading(true);
//     setError("");
//     try {
//       // (A) Process payment
//       const paymentRes = await fetch("/api/payments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           flightId,
//           seatAllocationIds,
//           totalPrice,
//         }),
//       });
//       const paymentData = await paymentRes.json();
//       if (!paymentRes.ok) {
//         setError(paymentData.error || "Payment failed");
//         setLoading(false);
//         return;
//       }

//       // (B) If payment is successful, store passenger details
//       const newReservationId = paymentData.reservationId;
//       setReservationId(newReservationId);

//       const passengersRes = await fetch("/api/passangers", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           reservationId: newReservationId,
//           passengers: passengerDetails,
//         }),
//       });
//       const passengersData = await passengersRes.json();
//       if (!passengersRes.ok) {
//         setError(passengersData.error || "Error storing passenger details");
//         setLoading(false);
//         return;
//       }

//       // (C) Done! We set reservationId, which triggers the success UI.
//     } catch (err) {
//       console.error("Error processing payment:", err);
//       setError("Payment processing error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 5. Once reservationId is set, show a success page.
//   if (reservationId) {
//     // Gather seat numbers from passengerDetails
//     const selectedSeatNumbers = passengerDetails
//       .map((p) => p.seat_number)
//       .join(", ");

//     return (
//       <div>
//         <Navbar />
//         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//           <h1 className="text-3xl font-bold mb-4">Payment Page</h1>
//           <p>Flight ID: {flightId}</p>
//           <p>Selected Seats: {selectedSeatNumbers}</p>
//           <p>Total Price: ${totalPrice?.toFixed(2)}</p>
//           <p className="text-green-600 mt-2">Payment successful!</p>
//           <p>Reservation ID: {reservationId}</p>
//           <p>Total Price: ${totalPrice?.toFixed(2)}</p>
//           <button
//             onClick={() => router.push("/")}
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 6. Otherwise, show the payment form
//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//         <h1 className="text-3xl font-bold mb-4">Payment & Passenger Details</h1>
//         <p>Flight ID: {flightId}</p>
//         <p>
//           Total Price:{" "}
//           {totalPrice ? `$${totalPrice.toFixed(2)}` : "Calculating..."}
//         </p>

//         {/* Passenger Details Form */}
//         <div className="w-full max-w-xl mt-6">
//           <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
//           {passengerDetails.length > 0 ? (
//             passengerDetails.map((passenger, index) => (
//               <div key={index} className="mb-4 border p-4 rounded">
//                 <h3 className="font-semibold mb-2">
//                   Seat Number: {passenger.seat_number}
//                 </h3>
//                 <div className="mb-2">
//                   <label className="block mb-1">Full Name:</label>
//                   <input
//                     type="text"
//                     placeholder="Enter full name"
//                     value={passenger.full_name}
//                     onChange={(e) =>
//                       handlePassengerChange(index, "full_name", e.target.value)
//                     }
//                     className="border p-2 w-full"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label className="block mb-1">Passport Number:</label>
//                   <input
//                     type="text"
//                     placeholder="Enter passport number"
//                     value={passenger.passport_number}
//                     onChange={(e) =>
//                       handlePassengerChange(
//                         index,
//                         "passport_number",
//                         e.target.value
//                       )
//                     }
//                     className="border p-2 w-full"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label className="block mb-1">Date of Birth:</label>
//                   <input
//                     type="date"
//                     value={passenger.date_of_birth}
//                     onChange={(e) =>
//                       handlePassengerChange(
//                         index,
//                         "date_of_birth",
//                         e.target.value
//                       )
//                     }
//                     className="border p-2 w-full"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label className="block mb-1">Seat Number:</label>
//                   <input
//                     type="text"
//                     value={passenger.seat_number}
//                     disabled
//                     className="border p-2 w-full bg-gray-200"
//                   />
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>Loading seat details...</p>
//           )}
//         </div>

//         {error && <p className="text-red-600 mt-4">{error}</p>}

//         {isLoggedIn ? (
//           <button
//             onClick={handlePayment}
//             disabled={loading}
//             className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
//           >
//             {loading ? "Processing..." : "Pay Now"}
//           </button>
//         ) : (
//           <button
//             onClick={() => router.push("/login")}
//             className="mt-6 bg-yellow-600 text-white px-4 py-2 rounded"
//           >
//             Login to Pay
//           </button>
//         )}
//       </div>
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
  const secondFlightId = searchParams.get("secondFlightId"); // For connecting flight (optional)
  const seatIdsParam = searchParams.get("seatIds") || searchParams.get("seatIdsFirst");
  const seatIdsSecondParam = searchParams.get("seatIdsSecond");
  const priceParam = searchParams.get("price");

  const seatAllocationIds = seatIdsParam ? seatIdsParam.split(",").map(Number) : [];
  const seatAllocationIdsSecond = seatIdsSecondParam ? seatIdsSecondParam.split(",").map(Number) : [];
  const totalPrice = priceParam ? parseFloat(priceParam) : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservationId, setReservationId] = useState(null);

  // Seat details for each flight
  const [seatDetails, setSeatDetails] = useState([]);
  const [seatDetailsSecond, setSeatDetailsSecond] = useState([]);

  // For single flight bookings
  const [passengerDetails, setPassengerDetails] = useState([]);
  // For multi-city (connecting flight) bookings, unify the details so that one passenger gets one seat on each flight.
  const [passengerDetailsUnified, setPassengerDetailsUnified] = useState([]);

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

  // 2. Fetch seat details for Flight 1
  useEffect(() => {
    if (!flightId) return;
    async function fetchSeatDetails() {
      try {
        const res = await fetch(`/api/seats?flightId=${encodeURIComponent(flightId)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error fetching seat details for Flight 1");
        } else {
          setSeatDetails(data.seats);
        }
      } catch (err) {
        console.error("Error fetching seat details for Flight 1:", err);
        setError("Failed to fetch seat details for Flight 1.");
      }
    }
    fetchSeatDetails();
  }, [flightId]);

  // 3. Fetch seat details for Flight 2 (if exists)
  useEffect(() => {
    if (!secondFlightId) return;
    async function fetchSeatDetailsSecond() {
      try {
        const res = await fetch(`/api/seats?flightId=${encodeURIComponent(secondFlightId)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error fetching seat details for Flight 2");
        } else {
          setSeatDetailsSecond(data.seats);
        }
      } catch (err) {
        console.error("Error fetching seat details for Flight 2:", err);
        setError("Failed to fetch seat details for Flight 2.");
      }
    }
    fetchSeatDetailsSecond();
  }, [secondFlightId]);

  // 4. Pre-populate passenger details
  useEffect(() => {
    if (secondFlightId) {
      // Multi-city booking: make sure both seat details are available
      if (seatDetails.length > 0 && seatDetailsSecond.length > 0 && passengerDetailsUnified.length === 0) {
        if (seatAllocationIds.length !== seatAllocationIdsSecond.length) {
          setError("Seat selection count mismatch between Flight 1 and Flight 2");
          return;
        }
        const initialUnified = seatAllocationIds.map((id, index) => {
          const seat1 = seatDetails.find(seat => seat.seat_allocation_id === id);
          const seat2 = seatDetailsSecond.find(seat => seat.seat_allocation_id === seatAllocationIdsSecond[index]);
          return {
            full_name: "",
            passport_number: "",
            date_of_birth: "",
            seat_number_flight1: seat1 ? seat1.seatnumber : "",
            seat_number_flight2: seat2 ? seat2.seatnumber : ""
          };
        });
        setPassengerDetailsUnified(initialUnified);
      }
    } else {
      // Single flight booking
      if (seatDetails.length > 0 && seatAllocationIds.length > 0 && passengerDetails.length === 0) {
        const selectedSeats = seatDetails.filter((seat) =>
          seatAllocationIds.includes(seat.seat_allocation_id)
        );
        const initialDetails = selectedSeats.map((seat) => ({
          full_name: "",
          passport_number: "",
          date_of_birth: "",
          seat_number: seat.seatnumber,
        }));
        setPassengerDetails(initialDetails);
      }
    }
  }, [secondFlightId, seatDetails, seatDetailsSecond, seatAllocationIds, seatAllocationIdsSecond, passengerDetailsUnified, passengerDetails]);

  // Handle change for single flight form
  const handlePassengerChange = (index, field, value) => {
    const newDetails = [...passengerDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setPassengerDetails(newDetails);
  };

  // Handle change for unified (multi-city) form
  const handleUnifiedChange = (index, field, value) => {
    const newDetails = [...passengerDetailsUnified];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setPassengerDetailsUnified(newDetails);
  };

  // 5. Process payment and store passenger details
  const handlePayment = async () => {
    // Validate fields
    if (secondFlightId) {
      for (let i = 0; i < passengerDetailsUnified.length; i++) {
        const {
          full_name,
          passport_number,
          date_of_birth,
          seat_number_flight1,
          seat_number_flight2,
        } = passengerDetailsUnified[i];
        if (
          !full_name ||
          !passport_number ||
          !date_of_birth ||
          !seat_number_flight1 ||
          !seat_number_flight2
        ) {
          setError(
            `Please fill out all details for passenger for Flight 1 seat ${seat_number_flight1} and Flight 2 seat ${seat_number_flight2}`
          );
          return;
        }
      }
    } else {
      for (let i = 0; i < passengerDetails.length; i++) {
        const { full_name, passport_number, date_of_birth, seat_number } = passengerDetails[i];
        if (!full_name || !passport_number || !date_of_birth || !seat_number) {
          setError(`Please fill out all details for the passenger for seat ${seat_number}`);
          return;
        }
      }
    }
  
    setLoading(true);
    setError("");
    try {
      // (A) Process payment payload
      const paymentPayload = {
        flightId,
        seatAllocationIds,
        totalPrice,
      };
      if (secondFlightId) {
        paymentPayload.secondFlightId = secondFlightId;
        paymentPayload.seatAllocationIdsSecond = seatAllocationIdsSecond;
      }
  
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        setError(paymentData.error || "Payment failed");
        setLoading(false);
        return;
      }
  
      // (B) Prepare unified passenger payload for storing details
      const newReservationId = paymentData.reservationId;
      setReservationId(newReservationId);
  
      let passengersPayload;
      if (secondFlightId) {
        // For multi-city booking, combine the two seat numbers into one string.
        const passengers = passengerDetailsUnified.map((passenger) => ({
          full_name: passenger.full_name,
          passport_number: passenger.passport_number,
          date_of_birth: passenger.date_of_birth,
          seat_number: `F1:${passenger.seat_number_flight1} | F2:${passenger.seat_number_flight2}`,
        }));
        passengersPayload = { reservationId: newReservationId, passengers };
      } else {
        // For single-flight booking, simply use the single seat number.
        const passengers = passengerDetails.map((passenger) => ({
          full_name: passenger.full_name,
          passport_number: passenger.passport_number,
          date_of_birth: passenger.date_of_birth,
          seat_number: passenger.seat_number,
        }));
        passengersPayload = { reservationId: newReservationId, passengers };
      }
  
      const passengersRes = await fetch("/api/passangers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passengersPayload),
      });
      const passengersData = await passengersRes.json();
      if (!passengersRes.ok) {
        setError(passengersData.error || "Error storing passenger details");
        setLoading(false);
        return;
      }
  
      // (C) Payment and passenger info stored successfully.
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Payment processing error");
    } finally {
      setLoading(false);
    }
  };  

  // 6. On success, show confirmation screen.
  if (reservationId) {
    const selectedSeatNumbersFlight1 = secondFlightId
      ? passengerDetailsUnified.map((p) => p.seat_number_flight1).join(", ")
      : passengerDetails.map((p) => p.seat_number).join(", ");
    const selectedSeatNumbersFlight2 = secondFlightId
      ? passengerDetailsUnified.map((p) => p.seat_number_flight2).join(", ")
      : "";
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p>Flight ID: {flightId}</p>
          {secondFlightId && <p>Flight 2 ID: {secondFlightId}</p>}
          <p>Selected Seats Flight 1: {selectedSeatNumbersFlight1}</p>
          {secondFlightId && <p>Selected Seats Flight 2: {selectedSeatNumbersFlight2}</p>}
          <p>Total Price: ₹ {totalPrice?.toFixed(2)}</p>
          <p>Reservation ID: {reservationId}</p>
          <button onClick={() => router.push("/")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // 7. Render the payment form
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-4">Payment & Passenger Details</h1>
        <p>Flight ID: {flightId}</p>
        {secondFlightId && <p>Flight 2 ID: {secondFlightId}</p>}
        <p>Total Price: {totalPrice ? `₹ ${totalPrice.toFixed(2)}` : "Calculating..."}</p>

        {secondFlightId ? (
          <div className="w-full max-w-xl mt-6">
            <h2 className="text-xl font-semibold mb-4">Passenger Details (Multi-city Booking)</h2>
            {passengerDetailsUnified.length > 0 ? (
              passengerDetailsUnified.map((passenger, index) => (
                <div key={index} className="mb-4 border p-4 rounded">
                  <h3 className="font-semibold mb-2">Passenger {index + 1}</h3>
                  <div className="mb-2">
                    <label className="block mb-1">Full Name:</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={passenger.full_name}
                      onChange={(e) => handleUnifiedChange(index, "full_name", e.target.value)}
                      className="border p-2 w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Passport Number:</label>
                    <input
                      type="text"
                      placeholder="Enter passport number"
                      value={passenger.passport_number}
                      onChange={(e) => handleUnifiedChange(index, "passport_number", e.target.value)}
                      className="border p-2 w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Date of Birth:</label>
                    <input
                      type="date"
                      value={passenger.date_of_birth}
                      onChange={(e) => handleUnifiedChange(index, "date_of_birth", e.target.value)}
                      className="border p-2 w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Flight 1 Seat Number:</label>
                    <input
                      type="text"
                      value={passenger.seat_number_flight1}
                      disabled
                      className="border p-2 w-full bg-gray-200"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Flight 2 Seat Number:</label>
                    <input
                      type="text"
                      value={passenger.seat_number_flight2}
                      disabled
                      className="border p-2 w-full bg-gray-200"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>Loading seat details for multi-city booking...</p>
            )}
          </div>
        ) : (
          <div className="w-full max-w-xl mt-6">
            <h2 className="text-xl font-semibold mb-4">Passenger Details for Flight 1</h2>
            {passengerDetails.length > 0 ? (
              passengerDetails.map((passenger, index) => (
                <div key={index} className="mb-4 border p-4 rounded">
                  <h3 className="font-semibold mb-2">Seat Number: {passenger.seat_number}</h3>
                  <div className="mb-2">
                    <label className="block mb-1">Full Name:</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={passenger.full_name}
                      onChange={(e) => handlePassengerChange(index, "full_name", e.target.value)}
                      className="border p-2 w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Passport Number:</label>
                    <input
                      type="text"
                      placeholder="Enter passport number"
                      value={passenger.passport_number}
                      onChange={(e) => handlePassengerChange(index, "passport_number", e.target.value)}
                      className="border p-2 w-full"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Date of Birth:</label>
                    <input
                      type="date"
                      value={passenger.date_of_birth}
                      onChange={(e) => handlePassengerChange(index, "date_of_birth", e.target.value)}
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
              <p>Loading seat details for Flight 1...</p>
            )}
          </div>
        )}

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
