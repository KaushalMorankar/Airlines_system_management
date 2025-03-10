import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function POST(req) {
  try {
    // Extract JWT token from cookies
    const cookie = req.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      );
    }
    const token = tokenMatch[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err);
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401 }
      );
    }
    const userId = decoded.id; // Get the user id from the token

    const { flightId } = await req.json();
    if (!flightId) {
      return new Response(
        JSON.stringify({ error: "Flight ID is required" }),
        { status: 400 }
      );
    }

    // Insert a new reservation using the logged-in user ID.
    const reservationRes = await pool.query(
      `INSERT INTO reservations (user_id, flight_id, bookingdate, status, total_price)
       VALUES ($1, $2, CURRENT_DATE, 'Confirmed', 100) RETURNING *`,
      [userId, flightId]
    );
    const reservation = reservationRes.rows[0];

    // Optionally, create a payment record.
    const paymentRes = await pool.query(
      `INSERT INTO payments (payment_date, amount, payment_method, payment_status)
       VALUES ( CURRENT_DATE, $2, 'Card', 'Paid') RETURNING *`,
      [reservation.total_price]
    );
    const payment = paymentRes.rows[0];

    return new Response(JSON.stringify({ reservation }), { status: 201 });
  } catch (error) {
    console.error("Reservation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
