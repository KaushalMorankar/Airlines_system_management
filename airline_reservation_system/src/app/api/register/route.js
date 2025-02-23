import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { full_name, email, phone_number, address, password } = await req.json();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    await pool.query(
      "INSERT INTO users (full_name, email, phone_number, address, password_hash) VALUES ($1, $2, $3, $4, $5)",
      [full_name, email, phone_number, address, hashedPassword]
    );

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
