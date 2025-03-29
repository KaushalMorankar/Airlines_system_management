import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function POST(request) {
  try {
    // 1. JWT Authentication: Extract the token from cookies and verify it.
    const cookie = request.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const token = tokenMatch[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Instead of using decoded.id directly, get the user ID from the users table using the email.
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

    // 3. Parse the request body and validate required fields.
    //flightId and an array of seatAllocationIds.
    const { flightId, seatAllocationIds } = await request.json();
    if (!flightId || !seatAllocationIds || seatAllocationIds.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: flightId and seatAllocationIds" },
        { status: 400 }
      );
    }

    // 4. transaction to ensure data consistency.
    await pool.query("BEGIN");

    // 5. Retrieve and lock the selected seat records to prevent concurrent updates.
    const seatQuery = `
      SELECT seat_allocation_id, seatnumber, seat_class
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

    // 6. Dynamic Pricing: Calculate the total price by summing the current price for each seat.
    let totalPrice = 0;
    for (const seat of seats) {
      const pricingQuery = `
        SELECT current_price
        FROM pricing
        WHERE flight_id = $1 AND seat_class = $2
      `;
      const pricingRes = await pool.query(pricingQuery, [
        flightId,
        seat.seat_class,
      ]);
      if (pricingRes.rows.length === 0) {
        await pool.query("ROLLBACK");
        return NextResponse.json(
          { error: `Pricing info not found for seat class ${seat.seat_class}` },
          { status: 404 }
        );
      }
      const price = parseFloat(pricingRes.rows[0].current_price);
      totalPrice += price;
    }

    // 7. Create the reservation record with the calculated total price.
    const reservationInsertQuery = `
      INSERT INTO reservations (user_id, flight_id, bookingdate, status, total_price)
      VALUES ($1, $2, NOW(), 'Confirmed', $3)
      RETURNING reservation_id
    `;
    const reservationRes = await pool.query(reservationInsertQuery, [
      userId,
      flightId,
      totalPrice,
    ]);
    const reservationId = reservationRes.rows[0].reservation_id;

    // 8. Update the seat_allocation records to mark these seats as booked.
    const updateSeatQuery = `
      UPDATE seat_allocation
      SET reservation_id = $1, status = 'booked'
      WHERE seat_allocation_id = ANY($2::int[])
    `;
    await pool.query(updateSeatQuery, [reservationId, seatAllocationIds]);

    // 9. Commit the transaction.
    await pool.query("COMMIT");

    // 10. Return the reservation details.
    return NextResponse.json(
      { reservationId, totalPrice },
      { status: 201 }
    );
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
