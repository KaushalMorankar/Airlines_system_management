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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
        {error && <p className="text-red-500">{error}</p>}
        {bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.reservation_id} className="mb-4 p-4 border rounded">
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
                  <strong>Departure Airport:</strong> {booking.departure_airport_id}
                </div>
                <div>
                  <strong>Arrival Airport:</strong> {booking.arrival_airport_id}
                </div>
                <div>
                  <strong>Scheduled Departure:</strong>{" "}
                  {new Date(booking.scheduled_departure_time).toLocaleString()}
                </div>
                <div>
                  <strong>Scheduled Arrival:</strong>{" "}
                  {new Date(booking.scheduled_arrival_time).toLocaleString()}
                </div>
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
