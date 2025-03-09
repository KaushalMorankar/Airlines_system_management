export default function handler(req, res) {
    if (req.method === "POST") {
      res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict");
      return res.status(200).json({ message: "Logout successful" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  