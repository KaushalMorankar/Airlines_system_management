import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { passenger_name, email, phone } = await request.json();
    await pool.query(
      `INSERT INTO bookings (passenger_name, email, phone) VALUES ($1, $2, $3)`,
      [passenger_name, email, phone]
    );
    return NextResponse.json({ message: "Booking successful" });
  } catch (error) {
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}