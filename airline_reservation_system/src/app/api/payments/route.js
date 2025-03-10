import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { flightId, seatAllocationIds, userId } = body;
    if (
      !flightId ||
      !seatAllocationIds ||
      seatAllocationIds.length === 0 ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Begin transaction
    await pool.query("BEGIN");

    // 1. Calculate total price by summing the current_price from the pricing table
    let totalPrice = 0;
    // Lock selected seat rows for update
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
    // For each seat, get the pricing for the flight and its seat_class
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

    // 2. Insert a new reservation record
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

    // 3. Update each selected seat to mark it as booked and link to the reservation
    const updateSeatQuery = `
      UPDATE seat_allocation
      SET reservation_id = $1, status = 'booked'
      WHERE seat_allocation_id = ANY($2::int[])
    `;
    await pool.query(updateSeatQuery, [reservationId, seatAllocationIds]);

    // 4. Insert a ticket for each booked seat
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

    // 5. Optionally update pricing (for example, increase demand factor)
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

    await pool.query("COMMIT");
    return NextResponse.json(
      { reservationId, totalPrice },
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
