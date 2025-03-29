import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  if (!city) {
    return new NextResponse(JSON.stringify({ error: "City parameter is required" }), {
      status: 400,
    });
  }

  try {
    //parameterized query for safety; ILIKE for case-insensitive matching.
    const result = await pool.query(
      "SELECT * FROM airports WHERE city ILIKE $1",
      [`%${city}%`]
    );
    return new NextResponse(JSON.stringify({ airports: result.rows }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching airports:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch airports" }),
      { status: 500 }
    );
  }
}
