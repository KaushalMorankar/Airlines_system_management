import { NextResponse } from "next/server";

export async function POST() {
  // Clear the token cookie by setting Max-Age to 0
  return NextResponse.json(
    { message: "Logout successful" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict",
      },
    }
  );
}
