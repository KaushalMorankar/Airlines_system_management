// "use client";

// import React, { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";

// export default function BookingsPage() {
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState(null);

//   // Tabs: upcoming, cancelled, completed
//   const [activeTab, setActiveTab] = useState("UPCOMING");

//   // For modal (if you still want a “View & Manage” popup)
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   useEffect(() => {
//     async function fetchBookings() {
//       try {
//         const response = await fetch("/api/bookings");
//         const data = await response.json();
//         if (response.ok) {
//           setBookings(data.bookings);
//         } else {
//           setError(data.error || "Error fetching bookings");
//         }
//       } catch (err) {
//         console.error("Error fetching bookings", err);
//         setError("Failed to load bookings");
//       }
//     }
//     fetchBookings();
//   }, []);

//   // Helper to format a date string safely
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleString();
//   };

//   // Determine if a booking is “Cancelled”
//   const isCancelled = (status) => status?.toLowerCase() === "cancelled";

//   // Determine if a booking is “Completed”
//   // by comparing the final arrival time with the current time
//   const isCompleted = (booking) => {
//     // If the booking has flights, get the last flight's arrival time
//     if (!booking.flights || booking.flights.length === 0) return false;
//     const lastFlight = booking.flights[booking.flights.length - 1];
//     const arrivalTime = new Date(lastFlight.scheduled_arrival_time).getTime();
//     const now = Date.now();
//     return arrivalTime < now; // If arrival is before now, it’s completed
//   };

//   // For the top tabs, compute which tab a booking belongs to
//   const getBookingTab = (booking) => {
//     if (isCancelled(booking.status)) return "CANCELLED";
//     if (isCompleted(booking)) return "COMPLETED";
//     return "UPCOMING";
//   };

//   // Filter bookings based on activeTab
//   const filteredBookings = bookings.filter(
//     (b) => getBookingTab(b) === activeTab
//   );

//   // For modal
//   const handleViewBooking = (booking) => {
//     setSelectedBooking(booking);
//     setShowModal(true);
//   };
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedBooking(null);
//   };

//   // Example “Cancel Booking” function (if you want in modal)
//   const cancelBooking = async (reservationId, refundAmount) => {
//     try {
//       const response = await fetch("/api/reservations/cancel", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reservationId, refundAmount }),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         alert("Cancellation failed: " + (data.error || "Unknown error"));
//       } else {
//         alert(
//           "Cancellation successful. Refund processed. Refund ID: " + data.refundId
//         );
//         // Update the UI
//         setBookings((prev) =>
//           prev.map((booking) =>
//             booking.reservation_id === reservationId
//               ? { ...booking, status: "Cancelled" }
//               : booking
//           )
//         );
//         handleCloseModal();
//       }
//     } catch (err) {
//       console.error("Error cancelling booking", err);
//       alert("Error cancelling booking. Please try again later.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-300 text-white">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-extrabold text-center mb-8 text-black">My Bookings</h1>

//         {error && <p className="text-red-400 text-center mb-4">{error}</p>}

//         {/* TAB NAVIGATION */}
//         <div className="flex justify-center space-x-8 mb-6">
//           <button
//             className={`${
//               activeTab === "UPCOMING"
//                 ? "text-blue-400 border-b-2 border-blue-400"
//                 : "text-gray-600"
//             } pb-1 font-semibold`}
//             onClick={() => setActiveTab("UPCOMING")}
//           >
//             UPCOMING
//           </button>
//           <button
//             className={`${
//               activeTab === "CANCELLED"
//                 ? "text-blue-400 border-b-2 border-blue-400"
//                 : "text-gray-600"
//             } pb-1 font-semibold`}
//             onClick={() => setActiveTab("CANCELLED")}
//           >
//             CANCELLED
//           </button>
//           <button
//             className={`${
//               activeTab === "COMPLETED"
//                 ? "text-blue-400 border-b-2 border-blue-400"
//                 : "text-gray-600"
//             } pb-1 font-semibold`}
//             onClick={() => setActiveTab("COMPLETED")}
//           >
//             COMPLETED
//           </button>
//         </div>

//         {filteredBookings.length > 0 ? (
//           <div className="space-y-4">
//             {filteredBookings.map((booking) => {
//               const firstFlight = booking.flights?.[0];
//               const lastFlight =
//                 booking.flights?.[booking.flights.length - 1];

//                 const fromAirport = firstFlight?.departure_iata ?? "—";
//                 const toAirport = lastFlight?.arrival_iata ?? "—";
//               const departureTime = formatDate(
//                 firstFlight?.scheduled_departure_time
//               );
//               const arrivalTime = formatDate(
//                 lastFlight?.scheduled_arrival_time
//               );
//               const flightCount = booking.flights?.length || 0;
//               const flightType = flightCount === 1 ? "One Way Flight" : "Multi-Leg";

//               return (
//                 <div
//                   key={booking.reservation_id}
//                   className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-400 p-6 rounded-lg shadow"
//                 >
//                   {/* LEFT SIDE: minimal summary */}
//                   <div className="flex-1">
//                     <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
//                       <h2 className="text-xl font-bold">
//                         {fromAirport} &rarr; {toAirport}
//                       </h2>
//                       <p className="mt-1 md:mt-0 text-sm font-semibold text-yellow-400">
//                         {booking.status} &nbsp;•&nbsp; {flightType}
//                       </p>
//                     </div>
//                     <p className="text-sm mt-1">
//                       Booking ID:{" "}
//                       <span className="font-semibold">
//                         {booking.reservation_id}
//                       </span>
//                     </p>
//                     <p className="text-sm mt-2">
//                       <strong>From:</strong> {departureTime} &nbsp;|&nbsp; 
//                       <strong>To:</strong> {arrivalTime}
//                     </p>
//                     <p className="text-sm mt-1">
//                       <strong>Total Price:</strong> {booking.total_price}
//                     </p>
//                   </div>

//                   {/* RIGHT SIDE: Single “View & Manage Booking” button */}
//                   <div className="mt-4 md:mt-0">
//                     <button
//                       className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded font-semibold"
//                       onClick={() => handleViewBooking(booking)}
//                     >
//                       View &amp; Manage Booking
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <p className="text-center text-gray-400">No bookings found in this tab.</p>
//         )}
//       </div>

//       {/* MODAL (optional) */}
//       {showModal && selectedBooking && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
//             {/* Close Button */}
//             <button
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//               onClick={handleCloseModal}
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 8.586l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414l4.95-4.95-4.95-4.95A1 1 0 015.05 3.636l4.95 4.95z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>

//             <h2 className="text-xl font-bold mb-4">
//               Booking Details (ID: {selectedBooking.reservation_id})
//             </h2>

//             {/* Status + Price */}
//             <div className="flex items-center justify-between mb-2">
//               <div>
//                 <span className="font-semibold">Status:</span>{" "}
//                 <span
//                   className={
//                     isCancelled(selectedBooking.status)
//                       ? "text-red-500 font-bold"
//                       : isCompleted(selectedBooking)
//                       ? "text-green-600 font-bold"
//                       : "text-yellow-600 font-bold"
//                   }
//                 >
//                   {selectedBooking.status}
//                 </span>
//               </div>
//               <div>
//                 <span className="font-semibold">Total Price:</span>{" "}
//                 {selectedBooking.total_price}
//               </div>
//             </div>

//             {/* Flights */}
//             <div className="border-t border-gray-200 pt-4 mt-4">
//               <h3 className="font-semibold mb-2">Flights:</h3>
//               {selectedBooking.flights?.map((flight, index) => (
//                 <div
//                   key={index}
//                   className="p-3 mb-2 border rounded bg-gray-50 text-sm"
//                 >
//                   <div>
//                     <strong>Leg:</strong> {flight.flight_order}
//                   </div>
//                   <div>
//                     <strong>Flight ID:</strong> {flight.flight_id}
//                   </div>
//                   <div>
//                     <strong>Departure Airport:</strong>{" "}
//                     {flight.departure_city} ({flight.departure_iata})
//                   </div>
//                   <div>
//                     <strong>Arrival Airport:</strong>{" "}
//                     {flight.arrival_city} ({flight.arrival_iata})
//                   </div>
//                   <div>
//                     <strong>Departure Time:</strong>{" "}
//                     {formatDate(flight.scheduled_departure_time)}
//                   </div>
//                   <div>
//                     <strong>Arrival Time:</strong>{" "}
//                     {formatDate(flight.scheduled_arrival_time)}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-6 flex items-center justify-end space-x-3">
//               {/* Cancel Booking if not already cancelled or completed */}
//               {!isCancelled(selectedBooking.status) && !isCompleted(selectedBooking) && (
//                 <button
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
//                   onClick={() =>
//                     cancelBooking(
//                       selectedBooking.reservation_id,
//                       selectedBooking.total_price
//                     )
//                   }
//                 >
//                   Cancel Booking
//                 </button>
//               )}

//               <button
//                 className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black font-semibold"
//                 onClick={handleCloseModal}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  // Tabs: upcoming, cancelled, completed
  const [activeTab, setActiveTab] = useState("UPCOMING");

  // For modal (if you still want a “View & Manage” popup)
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();
        if (response.ok) {
          setBookings(data.bookings);
        } else {
          setError(data.error || "Error fetching bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings", err);
        setError("Failed to load bookings");
      }
    }
    fetchBookings();
  }, []);

  // Helper to format a date string safely
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  // Determine if a booking is “Cancelled”
  const isCancelled = (status) => status?.toLowerCase() === "cancelled";

  // Determine if a booking is “Completed”
  // by comparing the final arrival time with the current time
  const isCompleted = (booking) => {
    // If the booking has flights, get the last flight's arrival time
    if (!booking.flights || booking.flights.length === 0) return false;
    const lastFlight = booking.flights[booking.flights.length - 1];
    const arrivalTime = new Date(lastFlight.scheduled_arrival_time).getTime();
    const now = Date.now();
    return arrivalTime < now; // If arrival is before now, it’s completed
  };

  // For the top tabs, compute which tab a booking belongs to
  const getBookingTab = (booking) => {
    if (isCancelled(booking.status)) return "CANCELLED";
    if (isCompleted(booking)) return "COMPLETED";
    return "UPCOMING";
  };

  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter(
    (b) => getBookingTab(b) === activeTab
  );

  // For modal
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const cancelBooking = async (reservationId, refundAmount) => {
    try {
      const response = await fetch("/api/reservations/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservationId, refundAmount }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert("Cancellation failed: " + (data.error || "Unknown error"));
      } else {
        alert(
          "Cancellation successful. Refund processed. Refund ID: " + data.refundId
        );
        // Update the UI
        setBookings((prev) =>
          prev.map((booking) =>
            booking.reservation_id === reservationId
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );
        handleCloseModal();
      }
    } catch (err) {
      console.error("Error cancelling booking", err);
      alert("Error cancelling booking. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-black">
          My Bookings
        </h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* TAB NAVIGATION */}
        <div className="flex justify-center space-x-8 mb-6">
          <button
            className={`${
              activeTab === "UPCOMING"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-600"
            } pb-1 font-semibold`}
            onClick={() => setActiveTab("UPCOMING")}
          >
            UPCOMING
          </button>
          <button
            className={`${
              activeTab === "CANCELLED"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-600"
            } pb-1 font-semibold`}
            onClick={() => setActiveTab("CANCELLED")}
          >
            CANCELLED
          </button>
          <button
            className={`${
              activeTab === "COMPLETED"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-600"
            } pb-1 font-semibold`}
            onClick={() => setActiveTab("COMPLETED")}
          >
            COMPLETED
          </button>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const firstFlight = booking.flights?.[0];
              const lastFlight =
                booking.flights?.[booking.flights.length - 1];

              const fromAirport = firstFlight?.departure_iata ?? "—";
              const toAirport = lastFlight?.arrival_iata ?? "—";
              const departureTime = formatDate(
                firstFlight?.scheduled_departure_time
              );
              const arrivalTime = formatDate(
                lastFlight?.scheduled_arrival_time
              );
              const flightCount = booking.flights?.length || 0;
              const flightType =
                flightCount === 1 ? "One Way Flight" : "Multi-Leg";

              return (
                <div
                  key={booking.reservation_id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-400 p-6 rounded-lg shadow"
                >
                  {/* LEFT SIDE: minimal summary */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                      <h2 className="text-xl font-bold">
                        {fromAirport} &rarr; {toAirport}
                      </h2>
                      <p className="mt-1 md:mt-0 text-sm font-semibold text-yellow-400">
                        {booking.status} &nbsp;•&nbsp; {flightType}
                      </p>
                    </div>
                    <p className="text-sm mt-1">
                      Booking ID:{" "}
                      <span className="font-semibold">
                        {booking.reservation_id}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      <strong>From:</strong> {departureTime} &nbsp;|&nbsp;
                      <strong>To:</strong> {arrivalTime}
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Total Price:</strong> {booking.total_price}
                    </p>
                  </div>

                  {/* RIGHT SIDE: Single “View & Manage Booking” button */}
                  <div className="mt-4 md:mt-0">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded font-semibold"
                      onClick={() => handleViewBooking(booking)}
                    >
                      View &amp; Manage Booking
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No bookings found in this tab.
          </p>
        )}
      </div>

      {/* MODAL (optional) */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal container with scrolling */}
          <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414l4.95-4.95-4.95-4.95A1 1 0 015.05 3.636l4.95 4.95z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h2 className="text-xl font-bold mb-4">
              Booking Details (ID: {selectedBooking.reservation_id})
            </h2>

            {/* Status + Price */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    isCancelled(selectedBooking.status)
                      ? "text-red-500 font-bold"
                      : isCompleted(selectedBooking)
                      ? "text-green-600 font-bold"
                      : "text-yellow-600 font-bold"
                  }
                >
                  {selectedBooking.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Total Price: ₹ </span>{" "}
                {selectedBooking.total_price}
              </div>
            </div>

            {/* Flights */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold mb-2">Flights:</h3>
              {selectedBooking.flights?.map((flight, index) => (
                <div
                  key={index}
                  className="p-3 mb-2 border rounded bg-gray-50 text-sm"
                >
                  <div>
                    <strong>Leg:</strong> {flight.flight_order}
                  </div>
                  <div>
                    <strong>Flight ID:</strong> {flight.flight_id}
                  </div>
                  <div>
                    <strong>Departure Airport:</strong>{" "}
                    {flight.departure_city} ({flight.departure_iata})
                  </div>
                  <div>
                    <strong>Arrival Airport:</strong>{" "}
                    {flight.arrival_city} ({flight.arrival_iata})
                  </div>
                  <div>
                    <strong>Departure Time:</strong>{" "}
                    {formatDate(flight.scheduled_departure_time)}
                  </div>
                  <div>
                    <strong>Arrival Time:</strong>{" "}
                    {formatDate(flight.scheduled_arrival_time)}
                  </div>
                </div>
              ))}
            </div>

            {/* Passengers */}
            {selectedBooking.passengers && selectedBooking.passengers.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-semibold mb-2">Passengers:</h3>
                {selectedBooking.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="p-3 mb-2 border rounded bg-gray-50 text-sm"
                  >
                    <div>
                      <strong>Name:</strong> {passenger.full_name}
                    </div>
                    <div>
                      <strong>Passport:</strong> {passenger.passport_number}
                    </div>
                    <div>
                      <strong>Date of Birth:</strong>{" "}
                      {formatDate(passenger.date_of_birth)}
                    </div>
                    <div>
                      <strong>Seat Number:</strong> {passenger.seat_number}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end space-x-3">
              {/* Cancel Booking if not already cancelled or completed */}
              {!isCancelled(selectedBooking.status) &&
                !isCompleted(selectedBooking) && (
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
                    onClick={() =>
                      cancelBooking(
                        selectedBooking.reservation_id,
                        selectedBooking.total_price
                      )
                    }
                  >
                    Cancel Booking
                  </button>
                )}

              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black font-semibold"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
