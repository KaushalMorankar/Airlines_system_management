import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Compare password hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // Generate JWT token with user details
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create a response and set an HttpOnly cookie with the token.
    // Note: For local development, you may remove "Secure;" if not using HTTPS.
    const response = new Response(
      JSON.stringify({ message: "Login successful", user }),
      { status: 200 }
    );
    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`
    );
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
