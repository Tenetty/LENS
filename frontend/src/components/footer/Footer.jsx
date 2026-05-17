import React from "react";
import {
  FaWhatsappSquare,
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="cursor-pointer w-full bg-gradient-to-r from-gray-800 to-black py-16 px-10 grid md:grid-cols-2 gap-8 text-gray-300 relative overflow-hidden">
      <div className="z-10">
        <h3 className="text-2xl font-bold text-[#41A4FF] hover:scale-105 transition-transform duration-300">
        LENS
        </h3>
        <p className="py-4">
          Your gateway to authentic rural experiences. We connect travelers
          with hidden countryside gems, local homestays, scenic tours, and
          cultural adventures across rural destinations.
        </p>
        <div className="flex justify-start gap-10 md:w-[75%] my-6">
          <a
            href="#"
            className="text-gray-300 hover:text-[#41A4FF] transition duration-300"
          >
            <FaWhatsappSquare size={30} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-[#41A4FF] transition duration-300"
          >
            <FaFacebookSquare size={30} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-[#41A4FF] transition duration-300"
          >
            <FaInstagramSquare size={30} />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-[#41A4FF] transition duration-300"
          >
            <FaTwitterSquare size={30} />
          </a>
        </div>
      </div>
      <div className="flex md:justify-around justify-start mt-8 z-10">
        <div className="md:mr-8">
          <h6 className="font-bold text-[#41A4FF] hover:scale-105 transition-transform duration-300">
            Reservations
          </h6>
          <ul className="mt-2 font-light">
            {[
              "Hotels",
              "Tour Packages",
              "Vehicles",
              "Restaurants",
              "Events",
            ].map((item) => (
              <li
                key={item}
                className="py-2 text-sm hover:text-[#41A4FF] transition duration-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6 className="font-bold text-[#41A4FF] hover:scale-105 transition-transform duration-300">
            Support
          </h6>
          <ul className="mt-2 font-light">
            {["Contact us", "About us"].map((item) => (
              <li
                key={item}
                className="py-2 text-sm hover:text-[#41A4FF] transition duration-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-gradient-to-r from-[#41A4FF] to-transparent"></div>
    </div>
  );
};

export default Footer;
