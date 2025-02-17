import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md">
      <div className="text-white text-2xl font-bold">AirlineBooking</div>
      <div className="flex space-x-8">
        <Link legacyBehavior href="/">
          <a className="text-white hover:text-gray-200 transition-colors duration-200">Home</a>
        </Link>
        <Link legacyBehavior href="/flights">
          <a className="text-white hover:text-gray-200 transition-colors duration-200">Flights</a>
        </Link>
        <Link legacyBehavior href="/book">
          <a className="text-white hover:text-gray-200 transition-colors duration-200">Book Now</a>
        </Link>
        <Link legacyBehavior href="/contact">
          <a className="text-white hover:text-gray-200 transition-colors duration-200">Contact Us</a>
        </Link>
        <Link legacyBehavior href="/login">
          <a className="text-white hover:text-gray-200 transition-colors duration-200">Login</a>
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1541447270433-4cddc97bf0c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Airline Booking
        </h1>
        <p className="text-white text-xl md:text-2xl mb-8 drop-shadow">
          Book your flights with ease and enjoy exclusive deals!
        </p>
        <Link legacyBehavior href="/book">
          <a className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
            Book Now
          </a>
        </Link>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <h2 className="text-4xl text-center font-bold mb-12 text-gray-800">Why Choose Us?</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <FeatureCard
          imageUrl="https://img.icons8.com/fluency/96/000000/ticket.png"
          title="Easy Booking"
          description="User-friendly interface for a hassle-free booking experience."
        />
        <FeatureCard
          imageUrl="https://img.icons8.com/fluency/96/000000/price-tag.png"
          title="Best Prices"
          description="Competitive rates and great deals available for all flights."
        />
        <FeatureCard
          imageUrl="https://img.icons8.com/fluency/96/000000/customer-support.png"
          title="24/7 Support"
          description="Our dedicated team is here to help you anytime, anywhere."
        />
      </div>
    </section>
  );
}

function FeatureCard({ imageUrl, title, description }) {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-center">
        <Image src={imageUrl} alt={title} width={96} height={96} />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-gray-700">{title}</h3>
      <p className="mt-4 text-gray-600">{description}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-white">
        <p className="text-sm">&copy; {new Date().getFullYear()} AirlineBooking. All rights reserved.</p>
      </div>
    </footer>
  );
}
