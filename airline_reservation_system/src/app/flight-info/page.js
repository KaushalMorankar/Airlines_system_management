"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar"; // Ensure the path is correct

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
        const res = await fetch(
          `/api/seats?flightId=${encodeURIComponent(flightId)}`
        );
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

  // Compute total price on the client side using the fetched seat pricing.
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
    if (seat.status === "booked") return; // cannot select already booked seat
    if (selectedSeatIds.includes(seat.seat_allocation_id)) {
      setSelectedSeatIds(
        selectedSeatIds.filter((id) => id !== seat.seat_allocation_id)
      );
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.seat_allocation_id]);
    }
  };

  // Proceed to payment, passing flightId and selected seat IDs (unchanged route).
  const proceedToPayment = () => {
    if (selectedSeatIds.length === 0) {
      alert("Please select at least one seat to book.");
      return;
    }
    router.push(
      `/payments?flightId=${flightId}&seatIds=${selectedSeatIds.join(",")}`
    );
  };

  // Map selected seat IDs to their corresponding seat numbers.
  const selectedSeatNumbers = seats
    .filter((seat) => selectedSeatIds.includes(seat.seat_allocation_id))
    .map((seat) => seat.seatnumber);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold mb-4">
          Flight {flightId} Seat Layout
        </h1>
        {error && <p className="text-red-600">{error}</p>}
        {seats.length > 0 ? (
          <div className="grid grid-cols-6 gap-4">
            {seats.map((seat) => {
              const isSelected = selectedSeatIds.includes(
                seat.seat_allocation_id
              );
              return (
                <div
                  key={seat.seat_allocation_id}
                  onClick={() => toggleSelectSeat(seat)}
                  className={`p-4 border rounded text-center cursor-pointer 
                    ${
                      seat.status === "booked"
                        ? "bg-gray-400"
                        : isSelected
                        ? "bg-blue-300"
                        : "bg-green-200"
                    }`}
                >
                  <p className="font-bold">{seat.seatnumber}</p>
                  <p className="text-sm">{seat.seat_class}</p>
                  {seat.status === "booked" && (
                    <p className="text-xs text-white">Booked</p>
                  )}
                  {isSelected && <p className="text-xs text-white">Selected</p>}
                </div>
              );
            })}
          </div>
        ) : (
          !error && <p>No seats available for this flight.</p>
        )}
        {/* Display the seat numbers instead of seat IDs */}
        {selectedSeatIds.length > 0 && (
          <p className="mt-4 text-xl">
            Selected Seats: {selectedSeatNumbers.join(", ")}
          </p>
        )}
        {/* Display total price based on selection */}
        {selectedSeatIds.length > 0 && (
          <p className="mt-4 text-xl">
            Total Price:{" "}
            {totalPrice !== null ? `$${totalPrice.toFixed(2)}` : "Calculating..."}
          </p>
        )}
        <button
          onClick={proceedToPayment}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
