import pool from "@/lib/db";

export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }
  
  try {
    // Use a parameterized query with ILIKE for case-insensitive matching.
    const result = await pool.query(
      "SELECT * FROM airports WHERE city ILIKE $1",
      [`%${city}%`]
    );
    res.status(200).json({ airports: result.rows });
  } catch (error) {
    console.error("Error fetching airports:", error);
    res.status(500).json({ error: "Failed to fetch airports" });
  }
}
