import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

// Helper to extract the token from the cookie header
function extractToken(cookie = "") {
  const tokenMatch = cookie.match(/token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const token = extractToken(cookie);

  if (!token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }

  // Assuming your JWT payload contains the user's email.
  const userEmail = decoded.email;
  if (!userEmail) {
    return new Response(
      JSON.stringify({ error: "User information missing in token" }),
      { status: 400 }
    );
  }

  // Query to fetch the user ID from your users table.
  const userQuery = `
    SELECT user_id FROM users
    WHERE email = $1
    LIMIT 1;
  `;
  let userResult;
  try {
    userResult = await pool.query(userQuery, [userEmail]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Error fetching user" }), {
      status: 500,
    });
  }

  if (userResult.rows.length === 0) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  const userId = userResult.rows[0].user_id;

  // Query to fetch reservations for the user, joining with flight details.
  const query = `
    SELECT 
      r.reservation_id, 
      r.bookingdate, 
      r.status, 
      r.total_price,
      f.departure_airport_id, 
      f.arrival_airport_id, 
      f.scheduled_departure_time,
      f.scheduled_arrival_time
    FROM reservations r
    JOIN flights f ON r.flight_id = f.flight_id
    WHERE r.user_id = $1
    ORDER BY r.bookingdate DESC;
  `;

  try {
    const result = await pool.query(query, [userId]);
    return new Response(JSON.stringify({ bookings: result.rows }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
