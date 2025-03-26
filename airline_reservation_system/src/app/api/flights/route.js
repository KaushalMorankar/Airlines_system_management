// // import { NextResponse } from "next/server";
// // import pool from "@/lib/db";

// // export async function GET(request) {
// //   try {
// //     const { searchParams } = new URL(request.url);
// //     const from = searchParams.get("from");
// //     const to = searchParams.get("to");
    
// //     const query = `
// //       SELECT f.flight_id, f.flight_number, a1.name AS departure_airport, 
// //              a2.name AS arrival_airport, al.name AS airline, 
// //              f.scheduled_departure_time, f.scheduled_arrival_time
// //       FROM flights f
// //       JOIN airports a1 ON f.departure_airport_id = a1.airport_id
// //       JOIN airports a2 ON f.arrival_airport_id = a2.airport_id
// //       JOIN airlines al ON f.airline_id = al.airline_id
// //       WHERE a1.name ILIKE $1 AND a2.name ILIKE $2;
// //     `;
// //     const { rows } = await pool.query(query, [`%${from}%`, `%${to}%`]);
    
// //     return NextResponse.json(rows);
// //   } catch (error) {
// //     return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
// //   }
// // }


// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function GET(request) {
//   // Extract query parameters from the URL.
//   const { searchParams } = new URL(request.url);
//   const airportName = searchParams.get("airportName");
//   const destinationName = searchParams.get("destinationName");

//   if (!airportName || !destinationName) {
//     return NextResponse.json(
//       { error: "Both departure and destination airport names are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Retrieve the departure airport_id based on the provided airport name.
//     const departureResult = await pool.query(
//       'SELECT airport_id FROM airports WHERE name = $1',
//       [airportName]
//     );

//     if (departureResult.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Departure airport not found" },
//         { status: 404 }
//       );
//     }

//     const departureAirportId = departureResult.rows[0].airport_id;

//     // Retrieve the destination airport_id based on the provided destination name.
//     const destinationResult = await pool.query(
//       'SELECT airport_id FROM airports WHERE name = $1',
//       [destinationName]
//     );

//     if (destinationResult.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Destination airport not found" },
//         { status: 404 }
//       );
//     }

//     const destinationAirportId = destinationResult.rows[0].airport_id;

//     // Query flights where both departure and destination airport IDs match.
//     const flightsResult = await pool.query(
//       'SELECT * FROM flights WHERE departure_airport_id = $1 AND arrival_airport_id = $2',
//       [departureAirportId, destinationAirportId]
//     );

//     return NextResponse.json(
//       { flights: flightsResult.rows },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching flights:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


  // // src/app/api/flights/route.js
  // import { NextResponse } from 'next/server';
  // import pool from '@/lib/db';

  // export async function GET(request) {
  //   // Extract query parameters from the URL
  //   const { searchParams } = new URL(request.url);
  //   const departureAirport = searchParams.get("airportName");
  //   const destinationAirport = searchParams.get("destinationName");

  //   if (!departureAirport || !destinationAirport) {
  //     return NextResponse.json(
  //       { error: "Both departure and destination airport names are required" },
  //       { status: 400 }
  //     );
  //   }

  //   try {
  //     // Query the departure airport for its ID (and optionally, operational hours)
  //     const depRes = await pool.query(
  //       "SELECT airport_id FROM airports WHERE name = $1",
  //       [departureAirport]
  //     );
  //     if (depRes.rows.length === 0) {
  //       return NextResponse.json(
  //         { error: "Departure airport not found" },
  //         { status: 404 }
  //       );
  //     }
  //     const departureAirportId = depRes.rows[0].airport_id;

  //     // Query the destination airport for its ID
  //     const destRes = await pool.query(
  //       "SELECT airport_id FROM airports WHERE name = $1",
  //       [destinationAirport]
  //     );
  //     if (destRes.rows.length === 0) {
  //       return NextResponse.json(
  //         { error: "Destination airport not found" },
  //         { status: 404 }
  //       );
  //     }
  //     const destinationAirportId = destRes.rows[0].airport_id;

  //     // Retrieve the published schedule for the route between these two airports
  //     const scheduleRes = await pool.query(
  //       `SELECT * FROM airport_schedules 
  //       WHERE departure_airport_id = $1 AND arrival_airport_id = $2`,
  //       [departureAirportId, destinationAirportId]
  //     );

  //     if (scheduleRes.rows.length === 0) {
  //       return NextResponse.json(
  //         { error: "No schedule available for this route" },
  //         { status: 404 }
  //       );
  //     }
  //     // Return the first matching schedule
  //     const schedule = scheduleRes.rows[0];

  //     return NextResponse.json({ schedule }, { status: 200 });
  //   } catch (error) {
  //     console.error("Error fetching flight schedule:", error);
  //     return NextResponse.json(
  //       { error: "Internal server error" },
  //       { status: 500 }
  //     );
  //   }
  // }














//   import { NextResponse } from 'next/server';
// import pool from '@/lib/db';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const departureCity = searchParams.get("departureCity");
//   const destinationCity = searchParams.get("destinationCity");
//   const flightDateParam = searchParams.get("flightDate");

//   if (!departureCity || !destinationCity) {
//     return NextResponse.json(
//       { error: "Both departure and destination cities are required" },
//       { status: 400 }
//     );
//   }

//   const flightDate = flightDateParam
//     ? flightDateParam
//     : new Date().toISOString().split("T")[0];

//   try {
//     // Get departure airport_id
//     const depRes = await pool.query(
//       "SELECT airport_id FROM airports WHERE city = $1",
//       [departureCity]
//     );
//     if (depRes.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Departure airport not found" },
//         { status: 404 }
//       );
//     }
//     const departureAirportId = depRes.rows[0].airport_id;

//     // Get destination airport_id
//     const destRes = await pool.query(
//       "SELECT airport_id FROM airports WHERE city = $1",
//       [destinationCity]
//     );
//     if (destRes.rows.length === 0) {
//       return NextResponse.json(
//         { error: "Destination airport not found" },
//         { status: 404 }
//       );
//     }
//     const destinationAirportId = destRes.rows[0].airport_id;

//     // Retrieve flights along with pricing info
//     const flightsRes = await pool.query(
//       `SELECT f.*, 
//               (
//                 SELECT json_agg(json_build_object(
//                   'seat_class', p.seat_class,
//                   'base_price', p.base_price,
//                   'current_price', p.current_price,
//                   'demand_factor', p.demand_factor
//                 ))
//                 FROM pricing p
//                 WHERE p.flight_id = f.flight_id
//               ) AS pricing_info
//        FROM get_flights_for_date_no_aircraft($1, $2, $3::date, 4) f;`,
//       [departureAirportId, destinationAirportId, flightDate]
//     );

//     if (flightsRes.rows.length === 0) {
//       return NextResponse.json(
//         { error: "No flights available for this route on the given date" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ flights: flightsRes.rows }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching flight schedule:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }




// app/api/flights/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const departureCity = searchParams.get("departureCity");
  const destinationCity = searchParams.get("destinationCity");
  const flightDateParam = searchParams.get("flightDate");

  if (!departureCity || !destinationCity) {
    return NextResponse.json(
      { error: "Both departure and destination cities are required" },
      { status: 400 }
    );
  }

  const flightDate = flightDateParam
    ? flightDateParam
    : new Date().toISOString().split("T")[0];

  try {
    // Get departure airport_id
    const depRes = await pool.query(
      "SELECT airport_id FROM airports WHERE city ILIKE $1",
      [departureCity]
    );
    if (depRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Departure airport not found" },
        { status: 404 }
      );
    }
    const departureAirportId = depRes.rows[0].airport_id;

    // Get destination airport_id
    const destRes = await pool.query(
      "SELECT airport_id FROM airports WHERE city ILIKE $1",
      [destinationCity]
    );
    if (destRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Destination airport not found" },
        { status: 404 }
      );
    }
    const destinationAirportId = destRes.rows[0].airport_id;

    // --- Direct Flights Query ---
    const directFlightsRes = await pool.query(
      `SELECT 
         f.flight_id,
         f.departure_airport_id,
         f.arrival_airport_id,
         a_dep.iata_code AS departure_iata,
         a_arr.iata_code AS arrival_iata,
         f.scheduled_departure_time,
         f.scheduled_arrival_time,
         f.airline_id,
         f.aircraft_id,
         'direct' AS itinerary_type,
         (
           SELECT json_agg(json_build_object(
             'seat_class', p.seat_class,
             'base_price', p.base_price,
             'current_price', p.current_price,
             'demand_factor', p.demand_factor
           ))
           FROM pricing p
           WHERE p.flight_id = f.flight_id
         ) AS pricing_info
       FROM flights f
       JOIN airports a_dep ON f.departure_airport_id = a_dep.airport_id
       JOIN airports a_arr ON f.arrival_airport_id = a_arr.airport_id
       WHERE f.departure_airport_id = $1
         AND f.arrival_airport_id = $2
         AND date(f.scheduled_departure_time) = $3`,
      [departureAirportId, destinationAirportId, flightDate]
    );    

    // --- Connecting (One‑Stop) Flights Query ---
    const connectingFlightsRes = await pool.query(
      `SELECT 
        f1.flight_id AS first_flight_id,
        f2.flight_id AS second_flight_id,
        f1.departure_airport_id AS departure_airport_id,
        a1.iata_code AS departure_iata,
        f2.arrival_airport_id AS arrival_airport_id,
        a2.iata_code AS arrival_iata,
        f1.scheduled_departure_time AS first_departure,
        f1.scheduled_arrival_time AS first_arrival,
        f2.scheduled_departure_time AS second_departure,
        f2.scheduled_arrival_time AS second_arrival,
        f1.arrival_airport_id AS transit_airport,
        a3.iata_code AS transit_iata,
        'connecting' AS itinerary_type,
        (
          SELECT json_agg(json_build_object(
            'seat_class', p.seat_class,
            'base_price', p.base_price,
            'current_price', p.current_price,
            'demand_factor', p.demand_factor
          ))
          FROM pricing p
          WHERE p.flight_id = f1.flight_id
        ) AS pricing_info_first,
        (
          SELECT json_agg(json_build_object(
            'seat_class', p.seat_class,
            'base_price', p.base_price,
            'current_price', p.current_price,
            'demand_factor', p.demand_factor
          ))
          FROM pricing p
          WHERE p.flight_id = f2.flight_id
        ) AS pricing_info_second
      FROM flights f1
      JOIN flights f2 ON f1.arrival_airport_id = f2.departure_airport_id
      JOIN airports a1 ON f1.departure_airport_id = a1.airport_id
      JOIN airports a3 ON f1.arrival_airport_id = a3.airport_id
      JOIN airports a2 ON f2.arrival_airport_id = a2.airport_id
      WHERE f1.departure_airport_id = $1
        AND f2.arrival_airport_id = $2
        AND date(f1.scheduled_departure_time) = $3
        AND f1.scheduled_arrival_time < f2.scheduled_departure_time
        AND (f2.scheduled_departure_time - f1.scheduled_arrival_time) >= interval '30 minutes'
        AND (f2.scheduled_departure_time - f1.scheduled_arrival_time) <= interval '12 hours'`,
      [departureAirportId, destinationAirportId, flightDate]
    );    

    // Package both direct and connecting itineraries
    const itineraries = {
      direct: directFlightsRes.rows,
      connecting: connectingFlightsRes.rows,
    };

    if (
      itineraries.direct.length === 0 &&
      itineraries.connecting.length === 0
    ) {
      return NextResponse.json(
        { error: "No flights available for this route on the given date" },
        { status: 404 }
      );
    }

    return NextResponse.json({ itineraries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flight schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
