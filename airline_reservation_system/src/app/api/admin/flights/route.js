// src/app/api/admin/flights/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    // Now also require flight_id to be provided manually.
    const { flight_id, schedule_id, airline_id, aircraft_id } = body;

    if (!flight_id || !schedule_id || !airline_id || !aircraft_id) {
      return NextResponse.json(
        { error: "Missing required fields: flight_id, schedule_id, airline_id, and aircraft_id are required" },
        { status: 400 }
      );
    }

    // Look up the schedule details using schedule_id
    const scheduleRes = await pool.query(
      "SELECT * FROM airport_schedules WHERE schedule_id = $1",
      [schedule_id]
    );
    if (scheduleRes.rows.length === 0) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }
    const schedule = scheduleRes.rows[0];

    // Check if a flight is already scheduled in that slot
    const slotCheck = await pool.query(
      `SELECT * FROM flights 
       WHERE scheduled_departure_time = $1 
         AND scheduled_arrival_time = $2`,
      [schedule.scheduled_departure_time, schedule.scheduled_arrival_time]
    );
    if (slotCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "This schedule slot is already occupied" },
        { status: 409 }
      );
    }

    // Insert a new flight record using the schedule's details and the provided flight_id
    const insertRes = await pool.query(
      `INSERT INTO flights 
       (airline_id, aircraft_id, departure_airport_id, arrival_airport_id, scheduled_departure_time, scheduled_arrival_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
       [
         flight_id, // manually provided flight_id
         airline_id,
         aircraft_id,
         schedule.departure_airport_id,
         schedule.arrival_airport_id,
         schedule.scheduled_departure_time,
         schedule.scheduled_arrival_time,
         'Scheduled'
       ]
    );

    return NextResponse.json({ flight: insertRes.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error adding flight:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
