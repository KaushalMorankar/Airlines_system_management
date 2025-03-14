import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function POST(request) {
  try {
    // Parse the request body.
    const body = await request.json();
    const { flightId, seatAllocationIds, totalPrice } = body;
    if (
      !flightId ||
      !seatAllocationIds ||
      seatAllocationIds.length === 0 ||
      totalPrice === undefined
    ) {
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

    // Lock selected seats for update.
    const seatQuery = `
      SELECT seat_allocation_id, seatnumber, seat_class, status
      FROM seat_allocation
      WHERE seat_allocation_id = ANY($1::int[])
      FOR UPDATE
    `;
    const seatRes = await pool.query(seatQuery, [seatAllocationIds]);
    if (seatRes.rows.length !== seatAllocationIds.length) {
      await pool.query("ROLLBACK");
      return NextResponse.json(
        { error: "Some selected seats were not found" },
        { status: 404 }
      );
    }
    const seats = seatRes.rows;

    // Check if any seat is already booked.
    for (const seat of seats) {
      if (seat.status === "booked") {
        await pool.query("ROLLBACK");
        return NextResponse.json(
          { error: `Seat ${seat.seat_allocation_id} is already booked` },
          { status: 409 }
        );
      }
    }

    // Create the reservation.
    const insertReservationQuery = `
      INSERT INTO reservations (user_id, flight_id, bookingdate, status, total_price)
      VALUES ($1, $2, NOW(), 'Confirmed', $3)
      RETURNING reservation_id
    `;
    const reservationRes = await pool.query(insertReservationQuery, [
      userId,
      flightId,
      totalPrice,
    ]);
    const reservationId = reservationRes.rows[0].reservation_id;

    // Update selected seats to mark them as booked.
    const updateSeatQuery = `
      UPDATE seat_allocation
      SET reservation_id = $1, status = 'booked'
      WHERE seat_allocation_id = ANY($2::int[])
    `;
    await pool.query(updateSeatQuery, [reservationId, seatAllocationIds]);

    // Insert a ticket for each booked seat.
    for (const seat of seats) {
      const insertTicketQuery = `
        INSERT INTO tickets (reservation_id, flight_id, seatnumber, ticketstatus)
        VALUES ($1, $2, $3, 'Issued')
      `;
      await pool.query(insertTicketQuery, [
        reservationId,
        flightId,
        seat.seatnumber,
      ]);
    }

    // Optionally update pricing for each seat.
    for (const seat of seats) {
      const updatePricingQuery = `
        UPDATE pricing
        SET demand_factor = demand_factor + 0.05,
            current_price = base_price * (demand_factor + 0.05),
            last_update = NOW()
        WHERE flight_id = $1 AND seat_class = $2
      `;
      await pool.query(updatePricingQuery, [flightId, seat.seat_class]);
    }

    // Insert a payment record.
    const insertPaymentQuery = `
      INSERT INTO payments (reservation_id, payment_date, amount, payment_method, payment_status)
      VALUES ($1, CURRENT_DATE, $2, 'Card', 'Paid')
      RETURNING payment_id, reservation_id, payment_date, amount, payment_method, payment_status
    `;
    const paymentRes = await pool.query(insertPaymentQuery, [
      reservationId,
      totalPrice,
    ]);
    const payment = paymentRes.rows[0];

    // Commit the transaction.
    await pool.query("COMMIT");
    return NextResponse.json(
      { reservationId, totalPrice, payment },
      { status: 200 }
    );
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
