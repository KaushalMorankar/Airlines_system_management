"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar"; // Adjust the path if needed

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

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
      } catch (error) {
        console.error("Error fetching bookings", error);
        setError("Failed to load bookings");
      }
    }
    fetchBookings();
  }, []);

  // Function to cancel a booking.
  // Here, we are passing the total price as the refund amount for simplicity.
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
        alert("Cancellation successful. Refund processed. Refund ID: " + data.refundId);
        // Optionally update the UI for the cancelled booking.
        setBookings((prev) =>
          prev.map((booking) =>
            booking.reservation_id === reservationId
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling booking", error);
      alert("Error cancelling booking. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        {error && <p className="text-red-500">{error}</p>}
        {bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => (
              <li
                key={booking.reservation_id}
                className="mb-4 p-4 border rounded"
              >
                <div>
                  <strong>Booking Date:</strong>{" "}
                  {new Date(booking.bookingdate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Status:</strong> {booking.status}
                </div>
                <div>
                  <strong>Total Price:</strong> {booking.total_price}
                </div>
                <div>
                  <strong>Departure Airport:</strong>{" "}
                  {booking.departure_airport_id}
                </div>
                <div>
                  <strong>Arrival Airport:</strong>{" "}
                  {booking.arrival_airport_id}
                </div>
                <div>
                  <strong>Scheduled Departure:</strong>{" "}
                  {new Date(
                    booking.scheduled_departure_time
                  ).toLocaleString()}
                </div>
                <div>
                  <strong>Scheduled Arrival:</strong>{" "}
                  {new Date(booking.scheduled_arrival_time).toLocaleString()}
                </div>
                {/* Render the cancel button if the booking is not already cancelled */}
                {booking.status !== "Cancelled" && (
                  <button
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() =>
                      cancelBooking(booking.reservation_id, booking.total_price)
                    }
                  >
                    Cancel Booking
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
}
