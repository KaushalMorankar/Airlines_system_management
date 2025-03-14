import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function POST(request) {
  try {
    // Parse the request body.
    // Expected fields: reservationId and refundAmount (calculated per your refund policy)
    const body = await request.json();
    const { reservationId, refundAmount } = body;
    if (!reservationId || refundAmount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // JWT Authentication: Extract token from cookie and verify it.
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

    // Use the email from the token to retrieve the user ID.
    const userEmail = decoded.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: "User information missing in token" },
        { status: 400 }
      );
    }
    const userQuery = `
      SELECT user_id FROM users
      WHERE email = $1
      LIMIT 1;
    `;
    const userResult = await pool.query(userQuery, [userEmail]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = userResult.rows[0].user_id;

    // Begin a transaction.
    await pool.query("BEGIN");

    // Lock the reservation row for update.
    const reservationQuery = `
      SELECT reservation_id, status
      FROM reservations
      WHERE reservation_id = $1
      FOR UPDATE
    `;
    const reservationRes = await pool.query(reservationQuery, [reservationId]);
    if (reservationRes.rows.length === 0) {
      await pool.query("ROLLBACK");
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    const reservation = reservationRes.rows[0];

    // Check if the reservation is already cancelled.
    if (reservation.status === "Cancelled") {
      await pool.query("ROLLBACK");
      return NextResponse.json({ error: "Reservation already cancelled" }, { status: 409 });
    }

    // Ensure the reservation belongs to the user making the request.
    // (Assuming reservations has a user_id field)
    const ownerCheckQuery = `
      SELECT reservation_id FROM reservations
      WHERE reservation_id = $1 AND user_id = $2
    `;
    const ownerCheckRes = await pool.query(ownerCheckQuery, [reservationId, userId]);
    if (ownerCheckRes.rows.length === 0) {
      await pool.query("ROLLBACK");
      return NextResponse.json({ error: "Unauthorized cancellation" }, { status: 403 });
    }

    // Update the reservation status to "Cancelled".
    const updateReservationQuery = `
      UPDATE reservations
      SET status = 'Cancelled'
      WHERE reservation_id = $1
    `;
    await pool.query(updateReservationQuery, [reservationId]);

    // Update the seat allocation: free up seats (or mark them as cancelled/available).
    const updateSeatsQuery = `
      UPDATE seat_allocation
      SET reservation_id = NULL, status = 'not booked'
      WHERE reservation_id = $1
    `;
    await pool.query(updateSeatsQuery, [reservationId]);

    // Update tickets: mark them as cancelled.
    const updateTicketsQuery = `
      UPDATE tickets
      SET ticketstatus = 'Cancelled'
      WHERE reservation_id = $1
    `;
    await pool.query(updateTicketsQuery, [reservationId]);

    // Insert a refund record.
    const insertRefundQuery = `
      INSERT INTO refunds (reservation_id, refund_date, amount, refund_status)
      VALUES ($1, NOW(), $2, 'Processed')
      RETURNING refund_id
    `;
    const refundRes = await pool.query(insertRefundQuery, [reservationId, refundAmount]);
    const refundId = refundRes.rows[0].refund_id;

    // Optionally, update the payment record if you want to mark it as refunded.
    // const updatePaymentQuery = `
    //   UPDATE payments
    //   SET payment_status = 'Refunded'
    //   WHERE reservation_id = $1
    // `;
    // await pool.query(updatePaymentQuery, [reservationId]);

    // Commit the transaction.
    await pool.query("COMMIT");
    return NextResponse.json(
      { message: "Flight cancelled and refund processed", refundId },
      { status: 200 }
    );
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Cancellation processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
