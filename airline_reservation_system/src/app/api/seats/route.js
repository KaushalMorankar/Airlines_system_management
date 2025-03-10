// app/api/seats/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const flightId = searchParams.get('flightId');

  if (!flightId) {
    return NextResponse.json(
      { error: "Missing flightId" },
      { status: 400 }
    );
  }

  try {
    const seatsResult = await pool.query(
      `SELECT seat_allocation_id, flight_id, seatnumber, seat_class, reservation_id, status
       FROM seat_allocation
       WHERE flight_id = $1`,
      [flightId]
    );

    if (seatsResult.rows.length === 0) {
      return NextResponse.json(
        { error: "No seats found for this flight" },
        { status: 404 }
      );
    }

    return NextResponse.json({ seats: seatsResult.rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
