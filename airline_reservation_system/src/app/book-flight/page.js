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
import { useState } from 'react';

export default function BookFlight() {
  const [departureAirport, setDepartureAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSchedule(null);
    
    if (!departureAirport.trim() || !destinationAirport.trim()) {
      setError("Please enter both departure and destination airport names.");
      return;
    }
    
    try {
      const res = await fetch(
        `/api/flights?airportName=${encodeURIComponent(departureAirport)}&destinationName=${encodeURIComponent(destinationAirport)}`
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
    <div>
      <h1>Book Your Flight</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Departure Airport Name:
          <input 
            type="text" 
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
          />
        </label>
        <br />
        <label>
          Destination Airport Name:
          <input 
            type="text" 
            value={destinationAirport}
            onChange={(e) => setDestinationAirport(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Search Flight Schedule</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {schedule && (
        <div>
          <h2>Available Flight Schedule</h2>
          <p>
            Scheduled Departure Time: {new Date(schedule.scheduled_departure_time).toLocaleString()}
          </p>
          <p>
            Scheduled Arrival Time: {new Date(schedule.scheduled_arrival_time).toLocaleString()}
          </p>
          <p>Flight Duration: {schedule.flight_duration}</p>
        </div>
      )}
    </div>
  );
}
