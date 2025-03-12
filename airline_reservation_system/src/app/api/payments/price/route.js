import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const flightId = searchParams.get("flightId");
  const seatIdsParam = searchParams.get("seatIds"); // comma-separated list
  const seatAllocationIds = seatIdsParam
    ? seatIdsParam.split(",").map(Number)
    : [];

  if (!flightId || seatAllocationIds.length === 0) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { status: 400 }
    );
  }

  try {
    let totalPrice = 0;
    const seatQuery = `
      SELECT seat_allocation_id, seat_class
      FROM seat_allocation
      WHERE seat_allocation_id = ANY($1::int[])
    `;
    const seatRes = await pool.query(seatQuery, [seatAllocationIds]);
    if (seatRes.rows.length !== seatAllocationIds.length) {
      return new Response(
        JSON.stringify({ error: "Some selected seats were not found" }),
        { status: 404 }
      );
    }
    const seats = seatRes.rows;

    for (const seat of seats) {
      const pricingQuery = `
        SELECT current_price
        FROM pricing
        WHERE flight_id = $1 AND seat_class = $2
      `;
      const pricingRes = await pool.query(pricingQuery, [flightId, seat.seat_class]);
      if (pricingRes.rows.length === 0) {
        return new Response(
          JSON.stringify({ error: `Pricing info not found for seat class ${seat.seat_class}` }),
          { status: 404 }
        );
      }
      const price = parseFloat(pricingRes.rows[0].current_price);
      totalPrice += price;
    }

    return new Response(JSON.stringify({ totalPrice }), { status: 200 });
  } catch (error) {
    console.error("Error calculating price:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
