// "use client";
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// export default function BookFlight() {
//   const searchParams = useSearchParams();
//   const flight_id = searchParams.get("flight_id");
//   const [passenger, setPassenger] = useState({ name: "", email: "", phone: "" });
//   const [message, setMessage] = useState("");

//   const bookFlight = async () => {
//     const res = await fetch("/api/book-flight", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ flight_id, ...passenger }),
//     });
//     const data = await res.json();
//     setMessage(data.message || data.error);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">Book Flight</h1>
//       <input className="border p-2 block my-2" placeholder="Name" value={passenger.name} onChange={(e) => setPassenger({ ...passenger, name: e.target.value })} />
//       <input className="border p-2 block my-2" placeholder="Email" value={passenger.email} onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} />
//       <input className="border p-2 block my-2" placeholder="Phone" value={passenger.phone} onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })} />
//       <button className="bg-blue-500 text-white p-2" onClick={bookFlight}>Confirm Booking</button>
//       {message && <p className="mt-4 text-green-600">{message}</p>}
//     </div>
//   );
// }

"use client";
import { useState } from "react";

export default function BookFlight() {
  const [departureAirport, setDepartureAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSchedule(null);

    if (!departureAirport.trim() || !destinationAirport.trim()) {
      setError("Please enter both departure and destination airport names.");
      return;
    }

    try {
      const res = await fetch(
        `/api/flights?airportName=${encodeURIComponent(
          departureAirport
        )}&destinationName=${encodeURIComponent(destinationAirport)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        setSchedule(data.schedule);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch flight schedule.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Book Your Flight</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Departure Airport Name:
          </label>
          <input
            type="text"
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
            placeholder="Enter departure airport"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Destination Airport Name:
          </label>
          <input
            type="text"
            value={destinationAirport}
            onChange={(e) => setDestinationAirport(e.target.value)}
            placeholder="Enter destination airport"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search Flight Schedule
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {schedule && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            Available Flight Schedule
          </h2>
          <p className="mb-2">
            <span className="font-bold">Scheduled Departure Time:</span>{" "}
            {new Date(schedule.scheduled_departure_time).toLocaleString()}
          </p>
          <p className="mb-2">
            <span className="font-bold">Scheduled Arrival Time:</span>{" "}
            {new Date(schedule.scheduled_arrival_time).toLocaleString()}
          </p>
          <p className="mb-2">
            <span className="font-bold">Flight Duration:</span>{" "}
            {schedule.flight_duration}
          </p>
        </div>
      )}
    </div>
  );
}
      
