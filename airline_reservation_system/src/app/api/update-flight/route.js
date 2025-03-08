import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { flightId, aircraftId } = await request.json();

    if (!flightId || !aircraftId) {
      return NextResponse.json(
        { error: "Flight ID and Aircraft ID are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `SELECT update_flight_with_selected_aircraft($1, $2);`,
      [flightId, aircraftId]
    );

    return NextResponse.json({ message: "Flight updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating flight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
