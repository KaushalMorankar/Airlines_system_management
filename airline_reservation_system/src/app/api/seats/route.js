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
      `SELECT 
      s.seat_allocation_id, 
      s.flight_id, 
      s.seatnumber, 
      s.seat_class, 
      s.reservation_id, 
      s.status,
      p.current_price
    FROM seat_allocation s
    LEFT JOIN pricing p 
      ON s.flight_id = p.flight_id 
      AND s.seat_class = p.seat_class
    WHERE s.flight_id = $1
    ORDER BY s.seat_class ASC, CAST(s.seatnumber AS integer) ASC;`,
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
