import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function POST(req) {
  try {
    const { full_name, email, phone_number, address, password } = await req.json();

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return new Response(
        JSON.stringify({ message: "User already exists, please login" }),
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database and return the inserted record
    const result = await pool.query(
      "INSERT INTO users (full_name, email, phone_number, address, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [full_name, email, phone_number, address, hashedPassword]
    );
    const user = result.rows[0];

    // Generate JWT token with user details
    const token = jwt.sign({ id: user.user_id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Create response with HttpOnly cookie set with the token.
    const response = new Response(
      JSON.stringify({ message: "User registered successfully", user }),
      { status: 201 }
    );
    response.headers.set(
      "Set-Cookie",
      // In development on localhost, consider removing "Secure;" if using http.
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`
    );
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
