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



// "use client";
// import { useState } from "react";

// export default function BookFlight() {
//   const [departureAirport, setDepartureAirport] = useState("");
//   const [destinationAirport, setDestinationAirport] = useState("");
//   const [flightDate, setFlightDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [flights, setFlights] = useState([]);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setFlights([]);
    
//     if (!departureAirport.trim() || !destinationAirport.trim()) {
//       setError("Please enter departure, destination airport names.");
//       return;
//     }
    
//     try {
//       const res = await fetch(
//         `/api/flights?airportName=${encodeURIComponent(
//           departureAirport
//         )}&destinationName=${encodeURIComponent(
//           destinationAirport
//         )}&flightDate=${encodeURIComponent(flightDate)}`
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
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
//       <h1 className="text-3xl font-bold mb-6">Book Your Flight</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
//       >
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">
//             Departure Airport Name:
//           </label>
//           <input
//             type="text"
//             value={departureAirport}
//             onChange={(e) => setDepartureAirport(e.target.value)}
//             placeholder="Enter departure airport"
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">
//             Destination Airport Name:
//           </label>
//           <input
//             type="text"
//             value={destinationAirport}
//             onChange={(e) => setDestinationAirport(e.target.value)}
//             placeholder="Enter destination airport"
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2">Flight Date:</label>
//           <input
//             type="date"
//             value={flightDate}
//             onChange={(e) => setFlightDate(e.target.value)}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           Search Flights
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {flights.length > 0 && (
//         <div className="bg-white p-6 rounded-lg shadow-md mt-8 w-full max-w-md">
//           <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
//           <ul>
//             {flights.map((flight) => (
//               <li key={flight.flight_id} className="mb-4 border-b pb-2">
//                 <p>
//                   <span className="font-bold">Flight Number:</span> {flight.flight_id}
//                 </p>
//                 <p>
//                   <span className="font-bold">Departure Time:</span>{" "}
//                   {new Date(flight.scheduled_departure_time).toLocaleString()}
//                 </p>
//                 <p>
//                   <span className="font-bold">Arrival Time:</span>{" "}
//                   {new Date(flight.scheduled_arrival_time).toLocaleString()}
//                 </p>
//                 <p>
//                   <span className="font-bold">Status:</span> {flight.status}
//                 </p>
//                 {flight.pricing_info && (
//                   <ul className="mt-2">
//                     {flight.pricing_info.map((price, idx) => (
//                       <li key={idx} className="text-sm">
//                         <span className="font-bold">Class:</span> {price.seat_class} |{" "}
//                         <span className="font-bold">Base Price:</span> {price.base_price} |{" "}
//                         <span className="font-bold">Current Price:</span> {price.current_price} |{" "}
//                         <span className="font-bold">Demand Factor:</span> {price.demand_factor}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {!error && flights.length === 0 && (
//         <p className="mt-4 text-gray-600">No flights found for these airports.</p>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";

export default function BookFlight() {
  // Query input states for autocomplete
  const [departureQuery, setDepartureQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  // Selected cities (used for the flight search)
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  // Flight date and results state
  const [flightDate, setFlightDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");

  // Suggestions from the airports API
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  // Fetch suggestions for departure input with debounce
  useEffect(() => {
    // If there's no query or the query exactly equals the selected value, clear suggestions.
    if (!departureQuery.trim() || (selectedDeparture && departureQuery === selectedDeparture)) {
      setDepartureSuggestions([]);
      return;
    }
    const fetchDepartureSuggestions = async () => {
      try {
        const res = await fetch(
          `/api/airports?city=${encodeURIComponent(departureQuery)}`
        );
        const data = await res.json();
        if (res.ok) {
          setDepartureSuggestions(data.airports || []);
        } else {
          setDepartureSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching departure suggestions", error);
      }
    };

    const timer = setTimeout(fetchDepartureSuggestions, 300);
    return () => clearTimeout(timer);
  }, [departureQuery, selectedDeparture]);

  // Fetch suggestions for destination input with debounce
  useEffect(() => {
    if (!destinationQuery.trim() || (selectedDestination && destinationQuery === selectedDestination)) {
      setDestinationSuggestions([]);
      return;
    }
    const fetchDestinationSuggestions = async () => {
      try {
        const res = await fetch(
          `/api/airports?city=${encodeURIComponent(destinationQuery)}`
        );
        const data = await res.json();
        if (res.ok) {
          setDestinationSuggestions(data.airports || []);
        } else {
          setDestinationSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching destination suggestions", error);
      }
    };

    const timer = setTimeout(fetchDestinationSuggestions, 300);
    return () => clearTimeout(timer);
  }, [destinationQuery, selectedDestination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFlights([]);

    if (!selectedDeparture.trim() || !selectedDestination.trim()) {
      setError("Please select both departure and destination cities.");
      return;
    }

    try {
      const res = await fetch(
        `/api/flights?departureCity=${encodeURIComponent(
          selectedDeparture
        )}&destinationCity=${encodeURIComponent(
          selectedDestination
        )}&flightDate=${encodeURIComponent(flightDate)}`
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Book Your Flight</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        {/* Departure City Input with Autocomplete */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2">Departure City:</label>
          <input
            type="text"
            value={departureQuery}
            onChange={(e) => {
              setDepartureQuery(e.target.value);
              setSelectedDeparture(""); // reset selection when typing
            }}
            placeholder="Enter departure city"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoComplete="off"
          />
          {departureSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded-md w-full mt-1 max-h-48 overflow-y-auto">
              {departureSuggestions.map((airport) => (
                <li
                  key={airport.airport_id} // ensure this is unique
                  onClick={() => {
                    setSelectedDeparture(airport.city);
                    setDepartureQuery(airport.city);
                    setDepartureSuggestions([]);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {airport.city} - {airport.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination City Input with Autocomplete */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2">Destination City:</label>
          <input
            type="text"
            value={destinationQuery}
            onChange={(e) => {
              setDestinationQuery(e.target.value);
              setSelectedDestination("");
            }}
            placeholder="Enter destination city"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoComplete="off"
          />
          {destinationSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded-md w-full mt-1 max-h-48 overflow-y-auto">
              {destinationSuggestions.map((airport) => (
                <li
                  key={airport.airport_id} // use the unique field here as well
                  onClick={() => {
                    setSelectedDestination(airport.city);
                    setDestinationQuery(airport.city);
                    setDestinationSuggestions([]);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {airport.city} - {airport.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Flight Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Flight Date:</label>
          <input
            type="date"
            value={flightDate}
            onChange={(e) => setFlightDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Search Flights
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {flights.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
          <ul>
            {flights.map((flight) => (
              <li key={flight.flight_id} className="mb-4 border-b pb-2">
                <p>
                  <span className="font-bold">Flight Number:</span> {flight.flight_id}
                </p>
                <p>
                  <span className="font-bold">Departure Time:</span>{" "}
                  {new Date(flight.scheduled_departure_time).toLocaleString()}
                </p>
                <p>
                  <span className="font-bold">Arrival Time:</span>{" "}
                  {new Date(flight.scheduled_arrival_time).toLocaleString()}
                </p>
                <p>
                  <span className="font-bold">Status:</span> {flight.status}
                </p>
                {flight.pricing_info && (
                  <ul className="mt-2">
                    {flight.pricing_info.map((price, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-bold">Class:</span> {price.seat_class} |{" "}
                        <span className="font-bold">Base Price:</span> {price.base_price} |{" "}
                        <span className="font-bold">Current Price:</span> {price.current_price} |{" "}
                        <span className="font-bold">Demand Factor:</span> {price.demand_factor}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!error && flights.length === 0 && (
        <p className="mt-4 text-gray-600">No flights found for these cities.</p>
      )}
    </div>
  );
}
