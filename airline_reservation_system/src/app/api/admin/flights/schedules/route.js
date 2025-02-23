// src/app/api/admin/flights/schedules/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const departureAirport = searchParams.get("departureAirport");
  const destinationAirport = searchParams.get("destinationAirport");

  if (!departureAirport || !destinationAirport) {
    return NextResponse.json(
      { error: "Both departure and destination airport names are required" },
      { status: 400 }
    );
  }

  try {
    // Look up departure airport ID
    const depRes = await pool.query(
      "SELECT airport_id FROM airports WHERE name = $1",
      [departureAirport]
    );
    if (depRes.rows.length === 0) {
      return NextResponse.json({ error: "Departure airport not found" }, { status: 404 });
    }
    const departureAirportId = depRes.rows[0].airport_id;

    // Look up destination airport ID
    const destRes = await pool.query(
      "SELECT airport_id FROM airports WHERE name = $1",
      [destinationAirport]
    );
    if (destRes.rows.length === 0) {
      return NextResponse.json({ error: "Destination airport not found" }, { status: 404 });
    }
    const destinationAirportId = destRes.rows[0].airport_id;

    // Retrieve available schedule slots for this route
    const scheduleRes = await pool.query(
      `SELECT * FROM airport_schedules 
       WHERE departure_airport_id = $1 AND arrival_airport_id = $2`,
      [departureAirportId, destinationAirportId]
    );

    if (scheduleRes.rows.length === 0) {
      return NextResponse.json({ error: "No schedule available for this route" }, { status: 404 });
    }

    return NextResponse.json({ schedules: scheduleRes.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
