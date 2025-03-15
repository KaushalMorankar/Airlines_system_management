"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function FlightInfo() {
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState("");
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);
  const searchParams = useSearchParams();
  const flightId = searchParams.get("flightId");
  const router = useRouter();

  // Fetch available seats (including pricing) for the flight.
  useEffect(() => {
    if (!flightId) return;
    const fetchSeats = async () => {
      try {
        const res = await fetch(`/api/seats?flightId=${encodeURIComponent(flightId)}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Error fetching seats");
        } else {
          setSeats(data.seats);
        }
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Failed to fetch seats.");
      }
    };
    fetchSeats();
  }, [flightId]);

  // Compute total price using the fetched seat pricing.
  useEffect(() => {
    if (selectedSeatIds.length > 0 && seats.length > 0) {
      const price = selectedSeatIds.reduce((acc, id) => {
        const seat = seats.find((s) => s.seat_allocation_id === id);
        return seat ? acc + parseFloat(seat.current_price || 0) : acc;
      }, 0);
      setTotalPrice(price);
    } else {
      setTotalPrice(null);
    }
  }, [selectedSeatIds, seats]);

  // Toggle selection state for a seat.
  const toggleSelectSeat = (seat) => {
    if (seat.status === "booked") return; // Cannot select already booked seat.
    if (selectedSeatIds.includes(seat.seat_allocation_id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.seat_allocation_id));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.seat_allocation_id]);
    }
  };

  // Proceed to payment.
  const proceedToPayment = () => {
    if (selectedSeatIds.length === 0) {
      alert("Please select at least one seat to book.");
      return;
    }
    if (totalPrice === null) {
      alert("Price is still calculating. Please wait.");
      return;
    }
    router.push(
      `/payments?flightId=${flightId}&seatIds=${selectedSeatIds.join(",")}&price=${totalPrice}`
    );
  };

  // Filter seats by class.
  const businessSeats = seats.filter(
    (seat) => seat.seat_class.toLowerCase() === "business"
  );
  const economySeats = seats.filter(
    (seat) => seat.seat_class.toLowerCase() === "economy"
  );

  // Sort seats by seat number (assuming they are numeric or simple strings).
  const sortSeats = (seatsArray) => {
    return seatsArray.sort((a, b) => {
      const aNum = parseInt(a.seatnumber, 10);
      const bNum = parseInt(b.seatnumber, 10);
      return aNum - bNum;
    });
  };

  const sortedBusinessSeats = sortSeats(businessSeats);
  const sortedEconomySeats = sortSeats(economySeats);

  // Group seats into rows of up to 4 seats each.
  const groupSeatsInRows = (seatsArray) => {
    const rows = [];
    for (let i = 0; i < seatsArray.length; i += 4) {
      rows.push(seatsArray.slice(i, i + 4));
    }
    return rows;
  };

  const businessRows = groupSeatsInRows(sortedBusinessSeats);
  const economyRows = groupSeatsInRows(sortedEconomySeats);

  // Render a row with 2 seats on the left and 2 on the right.
  const renderRow = (rowSeats) => {
    const leftSeats = rowSeats.slice(0, 2);
    const rightSeats = rowSeats.slice(2, 4);

    // Renders a single seat.
    const renderSeat = (seat) => {
      const isSelected = selectedSeatIds.includes(seat.seat_allocation_id);
      return (
        <div
          key={seat.seat_allocation_id}
          onClick={() => toggleSelectSeat(seat)}
          className={`w-12 h-12 flex items-center justify-center border rounded cursor-pointer ${
            seat.status === "booked"
              ? "bg-gray-400"
              : isSelected
              ? "bg-blue-300"
              : "bg-green-200"
          }`}
        >
          <span className="text-sm font-bold">{seat.seatnumber}</span>
        </div>
      );
    };

    return (
      <div className="flex items-center justify-center mb-4">
        {/* Left seats container */}
        <div className="flex space-x-2 w-24 justify-center">
          {leftSeats.length > 0 ? leftSeats.map(renderSeat) : <div className="w-12" />}
        </div>
        {/* Aisle Spacer */}
        <div className="w-8" />
        {/* Right seats container */}
        <div className="flex space-x-2 w-24 justify-center">
          {rightSeats.length > 0 ? rightSeats.map(renderSeat) : <div className="w-12" />}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Flight {flightId} Seat Layout</h1>
        {error && <p className="text-red-600 text-center">{error}</p>}
        {seats.length > 0 ? (
          <div className="space-y-12">
            {/* Business Class Section */}
            {businessRows.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Business Class</h2>
                <div className="flex flex-col items-center">
                  {businessRows.map((row, index) => (
                    <div key={index}>{renderRow(row)}</div>
                  ))}
                </div>
              </div>
            )}
            {/* Economy Class Section */}
            {economyRows.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">Economy Class</h2>
                <div className="flex flex-col items-center">
                  {economyRows.map((row, index) => (
                    <div key={index}>{renderRow(row)}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          !error && <p className="text-center">No seats available for this flight.</p>
        )}
        {selectedSeatIds.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xl">
              Selected Seats:{" "}
              {seats
                .filter((seat) => selectedSeatIds.includes(seat.seat_allocation_id))
                .map((seat) => seat.seatnumber)
                .join(", ")}
            </p>
            <p className="text-xl mt-2">
              Total Price:{" "}
              {totalPrice !== null ? `$${totalPrice.toFixed(2)}` : "Calculating..."}
            </p>
          </div>
        )}
        <div className="flex justify-center mt-6">
          <button
            onClick={proceedToPayment}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
