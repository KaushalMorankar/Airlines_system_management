// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar"; // Update path if necessary

// // Utility function to compute flight duration in "Xh Ym" format
// function computeDuration(departure, arrival) {
//   const dep = new Date(departure);
//   const arr = new Date(arrival);
//   const diffMs = arr - dep; // in milliseconds
//   if (isNaN(diffMs) || diffMs < 0) return ""; // handle invalid or negative times
//   const diffMins = Math.floor(diffMs / 60000);
//   const hours = Math.floor(diffMins / 60);
//   const mins = diffMins % 60;
//   return `${hours}h ${mins}m`;
// }

// export default function BookFlight() {
//   const [departureQuery, setDepartureQuery] = useState("");
//   const [destinationQuery, setDestinationQuery] = useState("");
//   const [selectedDeparture, setSelectedDeparture] = useState("");
//   const [selectedDestination, setSelectedDestination] = useState("");
//   const [flightDate, setFlightDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [flights, setFlights] = useState([]);
//   const [error, setError] = useState("");

//   // Suggestions from the airports API
//   const [departureSuggestions, setDepartureSuggestions] = useState([]);
//   const [destinationSuggestions, setDestinationSuggestions] = useState([]);

//   const router = useRouter();

//   // Fetch suggestions for departure input with debounce
//   useEffect(() => {
//     if (
//       !departureQuery.trim() ||
//       (selectedDeparture && departureQuery === selectedDeparture)
//     ) {
//       setDepartureSuggestions([]);
//       return;
//     }
//     const fetchDepartureSuggestions = async () => {
//       try {
//         const res = await fetch(
//           `/api/airports?city=${encodeURIComponent(departureQuery)}`
//         );
//         const data = await res.json();
//         if (res.ok) {
//           setDepartureSuggestions(data.airports || []);
//         } else {
//           setDepartureSuggestions([]);
//         }
//       } catch (error) {
//         console.error("Error fetching departure suggestions", error);
//       }
//     };

//     const timer = setTimeout(fetchDepartureSuggestions, 300);
//     return () => clearTimeout(timer);
//   }, [departureQuery, selectedDeparture]);

//   // Fetch suggestions for destination input with debounce
//   useEffect(() => {
//     if (
//       !destinationQuery.trim() ||
//       (selectedDestination && destinationQuery === selectedDestination)
//     ) {
//       setDestinationSuggestions([]);
//       return;
//     }
//     const fetchDestinationSuggestions = async () => {
//       try {
//         const res = await fetch(
//           `/api/airports?city=${encodeURIComponent(destinationQuery)}`
//         );
//         const data = await res.json();
//         if (res.ok) {
//           setDestinationSuggestions(data.airports || []);
//         } else {
//           setDestinationSuggestions([]);
//         }
//       } catch (error) {
//         console.error("Error fetching destination suggestions", error);
//       }
//     };

//     const timer = setTimeout(fetchDestinationSuggestions, 300);
//     return () => clearTimeout(timer);
//   }, [destinationQuery, selectedDestination]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setFlights([]);

//     if (!selectedDeparture.trim() || !selectedDestination.trim()) {
//       setError("Please select both departure and destination cities.");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `/api/flights?departureCity=${encodeURIComponent(
//           selectedDeparture
//         )}&destinationCity=${encodeURIComponent(
//           selectedDestination
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
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       {/* Hero Section */}
//       <header className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-white text-4xl font-bold">
//             Find Your Perfect Flight
//           </h1>
//           <p className="text-white mt-4 text-lg">
//             Book flights easily and quickly at the best prices
//           </p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-10">
//         {/* Search Form */}
//         <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-6">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Departure City:
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={departureQuery}
//                   onChange={(e) => {
//                     setDepartureQuery(e.target.value);
//                     setSelectedDeparture("");
//                   }}
//                   placeholder="Enter departure city"
//                   className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   autoComplete="off"
//                 />
//                 {departureSuggestions.length > 0 && (
//                   <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-48 overflow-y-auto">
//                     {departureSuggestions.map((airport) => (
//                       <li
//                         key={airport.airport_id}
//                         onClick={() => {
//                           setSelectedDeparture(airport.city);
//                           setDepartureQuery(airport.city);
//                           setDepartureSuggestions([]);
//                         }}
//                         className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
//                       >
//                         {airport.city} - {airport.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Destination City:
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={destinationQuery}
//                   onChange={(e) => {
//                     setDestinationQuery(e.target.value);
//                     setSelectedDestination("");
//                   }}
//                   placeholder="Enter destination city"
//                   className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   autoComplete="off"
//                 />
//                 {destinationSuggestions.length > 0 && (
//                   <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-48 overflow-y-auto">
//                     {destinationSuggestions.map((airport) => (
//                       <li
//                         key={airport.airport_id}
//                         onClick={() => {
//                           setSelectedDestination(airport.city);
//                           setDestinationQuery(airport.city);
//                           setDestinationSuggestions([]);
//                         }}
//                         className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
//                       >
//                         {airport.city} - {airport.name}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Flight Date:
//               </label>
//               <input
//                 type="date"
//                 value={flightDate}
//                 onChange={(e) => setFlightDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
//             >
//               Search Flights
//             </button>
//           </form>
//           {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
//         </div>

//         {/* Flights Display */}
//         {flights.length > 0 && (
//           <div className="mt-10 max-w-4xl mx-auto space-y-4">
//             <h2 className="text-2xl font-semibold mb-6 text-center">
//               Available Flights
//             </h2>
//             {flights.map((flight) => {
//               // Calculate duration
//               const duration = computeDuration(
//                 flight.scheduled_departure_time,
//                 flight.scheduled_arrival_time
//               );

//               return (
//                 <div
//                   key={flight.flight_id}
//                   className="flex flex-col md:flex-row items-center md:items-stretch justify-between bg-white rounded-lg shadow-md p-4"
//                 >
//                   {/* Airline/Flight Info & On-Time */}
//                   <div className="flex items-center md:w-1/5 border-b md:border-b-0 md:border-r md:pr-4 mb-4 md:mb-0">
//                     {/* Airline logo placeholder */}
//                     <div className="mr-3">
//                       <img
//                         src="/istockphoto-1258141375-612x612.jpg"
//                         alt="Airline Logo"
//                         className="w-12 h-12 object-contain"
//                       />
//                     </div>
//                     <div>
//                       <p className="text-lg font-bold">
//                         {flight.airline_name || "Airline"} {flight.flight_number}
//                       </p>
//                       {/* Example on-time or rating info */}
//                       <p className="text-sm text-green-700">98% on time</p>
//                     </div>
//                   </div>

//                   {/* Timing & Route Info */}
//                   <div className="flex flex-col md:flex-row md:w-3/5 items-center justify-around">
//                     {/* Departure */}
//                     <div className="text-center mb-2 md:mb-0">
//                       <p className="text-xl font-semibold">
//                         {new Date(flight.scheduled_departure_time).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         {flight.departure_city || "Departure"}
//                       </p>
//                     </div>

//                     {/* Duration & Non-stop Info */}
//                     <div className="text-center mb-2 md:mb-0">
//                       <p className="text-sm text-gray-600">{duration}</p>
//                       <p className="text-xs text-gray-400">
//                         {flight.non_stop ? "Non-stop" : "1+ stops"}
//                       </p>
//                     </div>

//                     {/* Arrival */}
//                     <div className="text-center">
//                       <p className="text-xl font-semibold">
//                         {new Date(flight.scheduled_arrival_time).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         {flight.destination_city || "Arrival"}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Price & Actions */}
//                   <div className="md:w-1/5 flex flex-col justify-between text-right">
//                     {/* Display all seat_class prices */}
//                     {flight.pricing_info && flight.pricing_info.length > 0 ? (
//                       flight.pricing_info.map((p) => (
//                         <div key={p.seat_class} className="mb-2">
//                           <p className="text-lg font-bold text-blue-700 capitalize">
//                             {p.seat_class}: ₹ {p.current_price}
//                           </p>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-xl font-bold text-blue-700">
//                         Price Unavailable
//                       </p>
//                     )}

//                     <button
//                       onClick={() =>
//                         router.push(`/flight-info?flightId=${flight.flight_id}`)
//                       }
//                       className="bg-blue-600 text-white py-2 px-3 rounded-md mt-2 hover:bg-blue-700 transition"
//                     >
//                       View Prices
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {!error && flights.length === 0 && (
//           <p className="mt-8 text-center text-gray-600">
//             No flights found for these cities.
//           </p>
//         )}
//       </main>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// Utility function to compute flight duration in "Xh Ym" format
function computeDuration(departure, arrival) {
  const dep = new Date(departure);
  const arr = new Date(arrival);
  const diffMs = arr - dep; // in milliseconds
  if (isNaN(diffMs) || diffMs < 0) return ""; // handle invalid or negative times
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
}

export default function BookFlight() {
  const [departureQuery, setDepartureQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [flightDate, setFlightDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // Retaining your original flights state for backward compatibility
  const [flights, setFlights] = useState([]);
  const [directItineraries, setDirectItineraries] = useState([]);
  const [connectingItineraries, setConnectingItineraries] = useState([]);
  const [error, setError] = useState("");

  // Suggestions from the airports API
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const router = useRouter();

  // Fetch suggestions for departure input with debounce
  useEffect(() => {
    if (
      !departureQuery.trim() ||
      (selectedDeparture && departureQuery === selectedDeparture)
    ) {
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
    if (
      !destinationQuery.trim() ||
      (selectedDestination && destinationQuery === selectedDestination)
    ) {
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
    // Clear previous results
    setFlights([]);
    setDirectItineraries([]);
    setConnectingItineraries([]);

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
        // If itineraries exist, use the new structure
        if (data.itineraries) {
          setDirectItineraries(data.itineraries.direct || []);
          setConnectingItineraries(data.itineraries.connecting || []);
        } else {
          // Fallback to previous behavior if needed
          setFlights(data.flights);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch flights.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white text-4xl font-bold">
            Find Your Perfect Flight
          </h1>
          <p className="text-white mt-4 text-lg">
            Book flights easily and quickly at the best prices
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Departure City:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={departureQuery}
                  onChange={(e) => {
                    setDepartureQuery(e.target.value);
                    setSelectedDeparture("");
                  }}
                  placeholder="Enter departure city"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                {departureSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-48 overflow-y-auto">
                    {departureSuggestions.map((airport) => (
                      <li
                        key={airport.airport_id}
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
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Destination City:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => {
                    setDestinationQuery(e.target.value);
                    setSelectedDestination("");
                  }}
                  placeholder="Enter destination city"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                {destinationSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-48 overflow-y-auto">
                    {destinationSuggestions.map((airport) => (
                      <li
                        key={airport.airport_id}
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
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Flight Date:
              </label>
              <input
                type="date"
                value={flightDate}
                onChange={(e) => setFlightDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Search Flights
            </button>
          </form>
          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        </div>

        {/* Display Direct Itineraries */}
        {directItineraries.length > 0 && (
          <div className="mt-10 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Direct Flights
            </h2>
            {directItineraries.map((flight) => {
              const duration = computeDuration(
                flight.scheduled_departure_time,
                flight.scheduled_arrival_time
              );
              return (
                <div
                  key={flight.flight_id}
                  className="flex flex-col md:flex-row items-center md:items-stretch justify-between bg-white rounded-lg shadow-md p-4"
                >
                  {/* Airline/Flight Info & On-Time */}
                  <div className="flex items-center md:w-1/5 border-b md:border-b-0 md:border-r md:pr-4 mb-4 md:mb-0">
                    <div className="mr-3">
                      <img
                        src="/istockphoto-1258141375-612x612.jpg"
                        alt="Airline Logo"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {flight.airline_name || "Airline"} {flight.flight_number}
                      </p>
                      <p className="text-sm text-green-700">98% on time</p>
                    </div>
                  </div>

                  {/* Timing & Route Info */}
                  <div className="flex flex-col md:flex-row md:w-3/5 items-center justify-around">
                    <div className="text-center mb-2 md:mb-0">
                      <p className="text-xl font-semibold">
                        {new Date(
                          flight.scheduled_departure_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {flight.departure_city || "Departure"}
                      </p>
                    </div>
                    <div className="text-center mb-2 md:mb-0">
                      <p className="text-sm text-gray-600">{duration}</p>
                      <p className="text-xs text-gray-400">
                        {flight.non_stop ? "Non-stop" : "1+ stops"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold">
                        {new Date(
                          flight.scheduled_arrival_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {flight.destination_city || "Arrival"}
                      </p>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="md:w-1/5 flex flex-col justify-between text-right">
                    {flight.pricing_info &&
                    flight.pricing_info.length > 0 ? (
                      flight.pricing_info.map((p) => (
                        <div key={p.seat_class} className="mb-2">
                          <p className="text-lg font-bold text-blue-700 capitalize">
                            {p.seat_class}: ₹ {p.current_price}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xl font-bold text-blue-700">
                        Price Unavailable
                      </p>
                    )}

                    <button
                      onClick={() =>
                        router.push(
                          `/flight-info?flightId=${flight.flight_id}`
                        )
                      }
                      className="bg-blue-600 text-white py-2 px-3 rounded-md mt-2 hover:bg-blue-700 transition"
                    >
                      View Prices
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Display Connecting (1 Stop) Itineraries */}
        {connectingItineraries.length > 0 && (
          <div className="mt-10 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Connecting Flights (1 Stop)
            </h2>
            {connectingItineraries.map((itinerary) => (
              <div
                key={`${itinerary.first_flight_id}-${itinerary.second_flight_id}`}
                className="bg-white rounded-lg shadow-md p-4 mb-4"
              >
                <p className="font-bold mb-1">
                  First Leg: Flight {itinerary.first_flight_id} – Departs at{" "}
                  {new Date(itinerary.first_departure).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="mb-1">
                  Arrives at:{" "}
                  {new Date(itinerary.first_arrival).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="font-bold mt-2 mb-1">
                  Second Leg: Flight {itinerary.second_flight_id} – Departs at{" "}
                  {new Date(itinerary.second_departure).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  Arrives at:{" "}
                  {new Date(itinerary.second_arrival).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/flight-info?flightId=${itinerary.first_flight_id}&secondFlightId=${itinerary.second_flight_id}`
                      )
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Prices
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback: Display previous flights if itineraries not returned */}
        {flights.length > 0 && directItineraries.length === 0 && connectingItineraries.length === 0 && (
          <div className="mt-10 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Available Flights
            </h2>
            {flights.map((flight) => {
              const duration = computeDuration(
                flight.scheduled_departure_time,
                flight.scheduled_arrival_time
              );
              return (
                <div
                  key={flight.flight_id}
                  className="flex flex-col md:flex-row items-center md:items-stretch justify-between bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center md:w-1/5 border-b md:border-b-0 md:border-r md:pr-4 mb-4 md:mb-0">
                    <div className="mr-3">
                      <img
                        src="/istockphoto-1258141375-612x612.jpg"
                        alt="Airline Logo"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {flight.airline_name || "Airline"} {flight.flight_number}
                      </p>
                      <p className="text-sm text-green-700">98% on time</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:w-3/5 items-center justify-around">
                    <div className="text-center mb-2 md:mb-0">
                      <p className="text-xl font-semibold">
                        {new Date(flight.scheduled_departure_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {flight.departure_city || "Departure"}
                      </p>
                    </div>

                    <div className="text-center mb-2 md:mb-0">
                      <p className="text-sm text-gray-600">{duration}</p>
                      <p className="text-xs text-gray-400">
                        {flight.non_stop ? "Non-stop" : "1+ stops"}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-semibold">
                        {new Date(flight.scheduled_arrival_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {flight.destination_city || "Arrival"}
                      </p>
                    </div>
                  </div>

                  <div className="md:w-1/5 flex flex-col justify-between text-right">
                    {flight.pricing_info &&
                    flight.pricing_info.length > 0 ? (
                      flight.pricing_info.map((p) => (
                        <div key={p.seat_class} className="mb-2">
                          <p className="text-lg font-bold text-blue-700 capitalize">
                            {p.seat_class}: ₹ {p.current_price}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xl font-bold text-blue-700">
                        Price Unavailable
                      </p>
                    )}

                    <button
                      onClick={() =>
                        router.push(`/flight-info?flightId=${flight.flight_id}`)
                      }
                      className="bg-blue-600 text-white py-2 px-3 rounded-md mt-2 hover:bg-blue-700 transition"
                    >
                      View Prices
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!error &&
          directItineraries.length === 0 &&
          connectingItineraries.length === 0 &&
          flights.length === 0 && (
            <p className="mt-8 text-center text-gray-600">
              No flights found for these cities.
            </p>
          )}
      </main>
    </div>
  );
}
