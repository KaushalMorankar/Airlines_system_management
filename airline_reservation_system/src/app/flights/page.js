// "use client";
// import { useState } from 'react';

// export default function BookFlight() {
//   const [departureAirport, setDepartureAirport] = useState('');
//   const [destinationAirport, setDestinationAirport] = useState('');
//   const [flights, setFlights] = useState([]);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setFlights([]);
    
//     if (!departureAirport.trim() || !destinationAirport.trim()) {
//       setError("Please enter both departure and destination airport names.");
//       return;
//     }
    
//     try {
//       const res = await fetch(
//         `/api/flights?airportName=${encodeURIComponent(departureAirport)}&destinationName=${encodeURIComponent(destinationAirport)}`
//       );
//       const data = await res.json();
      
//       if (!res.ok) {
//         setError(data.error || "An error occurred");
//       } else {
//         setFlights(data.flights);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to fetch flights.");
//     }
//   };

//   return (
//     <div>
//       <h1>Book Your Flight</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Departure Airport Name:
//           <input 
//             type="text" 
//             value={departureAirport}
//             onChange={(e) => setDepartureAirport(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           Destination Airport Name:
//           <input 
//             type="text" 
//             value={destinationAirport}
//             onChange={(e) => setDestinationAirport(e.target.value)}
//           />
//         </label>
//         <br />
//         <button type="submit">Search Flights</button>
//       </form>
      
//       {error && <p style={{color: 'red'}}>{error}</p>}
      
//       {flights.length > 0 ? (
//         <div>
//           <h2>Available Flights</h2>
//           <ul>
//             {flights.map((flight) => (
//               <li key={flight.flight_id}>
//                 Flight Number: {flight.flight_number} | 
//                 Departure Time: {flight.scheduled_departure_time} | 
//                 Arrival Time: {flight.scheduled_arrival_time} | 
//                 Status: {flight.status}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         !error && <p>No flights found for these airports.</p>
//       )}
//     </div>
//   );
// }



"use client";
import { useState } from 'react';

export default function BookFlight() {
  const [departureAirport, setDepartureAirport] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [flightDate, setFlightDate] = useState(new Date().toISOString().split('T')[0]);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFlights([]);
    
    if (!departureAirport.trim() || !destinationAirport.trim()) {
      setError("Please enter departure, destination airport names.");
      return;
    }
    
    try {
      const res = await fetch(
        `/api/flights?airportName=${encodeURIComponent(departureAirport)}&destinationName=${encodeURIComponent(destinationAirport)}&flightDate=${encodeURIComponent(flightDate)}`
      );
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "An error occurred");
      } else {
        setFlights(data.flights);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch flights.");
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
        <label>
          Flight Date:
          <input 
            type="date"
            value={flightDate}
            onChange={(e) => setFlightDate(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Search Flights</button>
      </form>
      
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      {flights.length > 0 ? (
        <div>
          <h2>Available Flights</h2>
          <ul>
            {flights.map((flight) => (
              <li key={flight.flight_id}>
                <p>
                  <strong>Flight Number:</strong> {flight.flight_id} | 
                  <strong> Departure Time:</strong> {flight.scheduled_departure_time} | 
                  <strong> Arrival Time:</strong> {flight.scheduled_arrival_time} | 
                  <strong> Status:</strong> {flight.status}
                </p>
                {flight.pricing_info && (
                  <ul>
                    {flight.pricing_info.map((price, idx) => (
                      <li key={idx}>
                        <strong>Class:</strong> {price.seat_class} | 
                        <strong> Base Price:</strong> {price.base_price} | 
                        <strong> Current Price:</strong> {price.current_price} | 
                        <strong> Demand Factor:</strong> {price.demand_factor}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !error && <p>No flights found for these airports.</p>
      )}
    </div>
  );
}

