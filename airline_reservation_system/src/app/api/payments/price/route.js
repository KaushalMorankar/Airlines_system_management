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
    const query = `
      SELECT SUM(p.current_price) AS total_price
      FROM seat_allocation sa
      JOIN pricing p ON sa.seat_class = p.seat_class
      WHERE sa.seat_allocation_id = ANY($1::int[])
        AND p.flight_id = $2
    `;
    const result = await pool.query(query, [seatAllocationIds, flightId]);
    const totalPrice = result.rows[0].total_price;
    if (totalPrice === null) {
      return new Response(
        JSON.stringify({ error: "Pricing info not found for selected seats" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({ totalPrice: parseFloat(totalPrice) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating price:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
