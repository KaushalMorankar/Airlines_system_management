// app/api/passangers/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET ||
  '97a9e10a5c110bfc771f5a8434da1ae45f8ff95521e75fe5f1fd9b6109f990dd1c0a9b364d876b8829757400aa7c253570226754b3fc60982cd138ead6ad6884';

export async function POST(request) {
  try {
    // 1. JWT Authentication: extract token from cookies.
    const cookie = request.headers.get('cookie') || '';
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const token = tokenMatch[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error('JWT verification error:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userEmail = decoded.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User information missing in token' }, { status: 400 });
    }
    const userQuery = `SELECT user_id FROM users WHERE email = $1 LIMIT 1;`;
    const userResult = await pool.query(userQuery, [userEmail]);
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userId = userResult.rows[0].user_id;

    // 2. Parse and validate request body.
    const body = await request.json();
    const { reservationId, passengers } = body;
    if (!reservationId) {
      return NextResponse.json({ error: 'Missing reservationId' }, { status: 400 });
    }
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json({ error: 'Missing passengers array' }, { status: 400 });
    }

    // 3. Verify reservation ownership.
    const reservationQuery = `SELECT user_id FROM reservations WHERE reservation_id = $1`;
    const reservationResult = await pool.query(reservationQuery, [reservationId]);
    if (reservationResult.rows.length === 0) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }
    const reservationUserId = reservationResult.rows[0].user_id;
    if (userId !== reservationUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 4. Validate each passenger object.
    for (const passenger of passengers) {
      const { full_name, passport_number, date_of_birth, seat_number } = passenger;
      if (!full_name || !passport_number || !date_of_birth || !seat_number) {
        return NextResponse.json(
          { error: 'Missing required passenger information' },
          { status: 400 }
        );
      }
    }

    // 5. Begin transaction.
    await pool.query('BEGIN');
    const insertedPassengers = [];

    // 6. Insert each passenger record.
    for (const passenger of passengers) {
      const { full_name, passport_number, date_of_birth, seat_number } = passenger;
      const insertQuery = `
        INSERT INTO passangers (reservation_id, full_name, passport_number, date_of_birth, seat_number)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING passenger_id, reservation_id, full_name, passport_number, date_of_birth, seat_number
      `;
      const result = await pool.query(insertQuery, [
        reservationId,
        full_name,
        passport_number,
        date_of_birth,
        seat_number,
      ]);
      insertedPassengers.push(result.rows[0]);
    }

    // 7. Commit transaction.
    await pool.query('COMMIT');
    return NextResponse.json({ insertedPassengers }, { status: 200 });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error inserting passengers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
