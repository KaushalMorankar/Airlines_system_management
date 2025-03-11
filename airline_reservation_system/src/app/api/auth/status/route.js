import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884";

export async function GET(request) {
  const cookie = request.headers.get("cookie") || "";
  const tokenMatch = cookie.match(/token=([^;]+)/);
  if (!tokenMatch) {
    return new Response(JSON.stringify({ isLoggedIn: false }), {
      status: 200,
    });
  }
  const token = tokenMatch[1];
  try {
    jwt.verify(token, JWT_SECRET);
    return new Response(JSON.stringify({ isLoggedIn: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ isLoggedIn: false }), {
      status: 200,
    });
  }
}
