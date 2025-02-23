"use client";
import { useState } from 'react';

export default function AdminAddFlight() {
  const [flightId, setFlightId] = useState(''); // New field for flight_id
  const [departureAirport, setDepartureAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [airlineId, setAirlineId] = useState('');
  const [aircraftId, setAircraftId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Step 1: Fetch available schedule slots for the route
  const fetchSchedules = async () => {
    setError('');
    setMessage('');
    setSchedules([]);
    setSelectedScheduleId('');
    
    if (!departureAirport.trim() || !destinationAirport.trim()) {
      setError("Please enter both departure and destination airport names.");
      return;
    }
    
    try {
      const res = await fetch(
        `/api/admin/flights/schedules?departureAirport=${encodeURIComponent(departureAirport)}&destinationAirport=${encodeURIComponent(destinationAirport)}`
      );
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to fetch schedules.");
      } else {
        setSchedules(data.schedules);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("An error occurred while fetching schedules.");
    }
  };

  // Step 2: Add a flight using the selected schedule slot
  const handleAddFlight = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!flightId.trim() || !selectedScheduleId || !airlineId.trim() || !aircraftId.trim()) {
      setError("Please fill in all required fields including flight ID, and select a schedule slot.");
      return;
    }
    
    try {
      const res = await fetch('/api/admin/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flight_id: flightId, // manually provided flight ID
          schedule_id: selectedScheduleId,
          airline_id: airlineId,
          aircraft_id: aircraftId
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to add flight.");
      } else {
        setMessage("Flight added successfully!");
      }
    } catch (err) {
      console.error("Error adding flight:", err);
      setError("An error occurred while adding the flight.");
    }
  };

  return (
    <div>
      <h1>Admin: Add Flight</h1>
      
      <div>
        <h2>Step 1: Fetch Available Schedule Slots</h2>
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
        <button onClick={fetchSchedules}>Fetch Schedules</button>
      </div>
      
      {schedules.length > 0 && (
        <div>
          <h2>Step 2: Select a Schedule Slot</h2>
          <select 
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
          >
            <option value="">Select a schedule slot</option>
            {schedules.map(schedule => (
              <option key={schedule.schedule_id} value={schedule.schedule_id}>
                {`Dep: ${new Date(schedule.scheduled_departure_time).toLocaleString()} - Arr: ${new Date(schedule.scheduled_arrival_time).toLocaleString()}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <h2>Step 3: Enter Flight Details and Add Flight</h2>
        <label>
          Flight ID:
          <input 
            type="text" 
            value={flightId}
            onChange={(e) => setFlightId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Airline ID:
          <input 
            type="text" 
            value={airlineId}
            onChange={(e) => setAirlineId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Aircraft ID:
          <input 
            type="text" 
            value={aircraftId}
            onChange={(e) => setAircraftId(e.target.value)}
          />
        </label>
        <br />
        <button onClick={handleAddFlight}>Add Flight</button>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
}
