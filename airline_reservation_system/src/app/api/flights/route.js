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



  import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  // Extract query parameters from the URL
  const { searchParams } = new URL(request.url);
  const departureAirport = searchParams.get("airportName");
  const destinationAirport = searchParams.get("destinationName");

  if (!departureAirport || !destinationAirport) {
    return NextResponse.json(
      { error: "Both departure and destination airport names are required" },
      { status: 400 }
    );
  }

  try {
    // Query for the departure airport ID
    const depRes = await pool.query(
      "SELECT airport_id FROM airports WHERE name = $1",
      [departureAirport]
    );
    if (depRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Departure airport not found" },
        { status: 404 }
      );
    }
    const departureAirportId = depRes.rows[0].airport_id;

    // Query for the destination airport ID
    const destRes = await pool.query(
      "SELECT airport_id FROM airports WHERE name = $1",
      [destinationAirport]
    );
    if (destRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Destination airport not found" },
        { status: 404 }
      );
    }
    const destinationAirportId = destRes.rows[0].airport_id;

    // Retrieve the schedule for the route between the two airports
    const scheduleRes = await pool.query(
      `SELECT * FROM airport_schedules 
       WHERE departure_airport_id = $1 AND arrival_airport_id = $2`,
      [departureAirportId, destinationAirportId]
    );

    if (scheduleRes.rows.length === 0) {
      return NextResponse.json(
        { error: "No schedule available for this route" },
        { status: 404 }
      );
    }

    // Wrap the schedule in an array so the client can safely use .length
    const schedule = scheduleRes.rows[0];
    return NextResponse.json({ flights: [schedule] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching flight schedule:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
