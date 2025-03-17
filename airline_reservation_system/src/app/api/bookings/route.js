// app/api/bookings/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function GET(request) {
  // Extract token from cookie
  const cookie = request.headers.get("cookie") || "";
  const tokenMatch = cookie.match(/token=([^;]+)/);
  if (!tokenMatch) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const token = tokenMatch[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const userEmail = decoded.email;
  if (!userEmail) {
    return NextResponse.json({ error: "User information missing in token" }, { status: 400 });
  }
  
  // Retrieve user_id from users table
  const userQuery = `SELECT user_id FROM users WHERE email = $1 LIMIT 1;`;
  let userResult;
  try {
    userResult = await pool.query(userQuery, [userEmail]);
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const userId = userResult.rows[0].user_id;
  
  // Updated query: join reservations, reservation_flights and flights,
  // and aggregate flights details for each reservation.
  const query = `
    SELECT 
      r.reservation_id, 
      r.bookingdate, 
      r.status, 
      r.total_price,
      json_agg(
        json_build_object(
          'flight_id', f.flight_id,
          'flight_order', rf.flight_order,
          'departure_airport_id', f.departure_airport_id,
          'arrival_airport_id', f.arrival_airport_id,
          'scheduled_departure_time', f.scheduled_departure_time,
          'scheduled_arrival_time', f.scheduled_arrival_time
        ) ORDER BY rf.flight_order
      ) AS flights
    FROM reservations r
    JOIN reservation_flights rf ON r.reservation_id = rf.reservation_id
    JOIN flights f ON rf.flight_id = f.flight_id
    WHERE r.user_id = $1
    GROUP BY r.reservation_id, r.bookingdate, r.status, r.total_price
    ORDER BY r.bookingdate DESC;
  `;
  
  try {
    const result = await pool.query(query, [userId]);
    return NextResponse.json({ bookings: result.rows }, { status: 200 });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
