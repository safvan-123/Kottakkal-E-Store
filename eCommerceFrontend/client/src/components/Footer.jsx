import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaPaypal,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-gray-400 py-8 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {/* Brand and Social */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">
              Kottakkal e-Store
            </h3>
            <p className="mb-3 text-xs leading-relaxed">
              Trendy and high-quality fashion for everyone. Stay stylish with
              e-Store.
            </p>
            <div className="flex flex-wrap gap-3 text-lg">
              <a href="#" className="hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-white">
                <FaLinkedinIn />
              </a>
              <a href="#" className="hover:text-white">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-md font-semibold mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/shop" className="hover:text-white">
                  Shop All
                </a>
              </li>
              <li>
                <a href="/new-arrivals" className="hover:text-white">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/sale" className="hover:text-white">
                  Sale
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white text-md font-semibold mb-3">
              Customer Care
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-white">
                  Returns
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-white">
                  Shipping
                </a>
              </li>
              <li>
                <a href="/size-guide" className="hover:text-white">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-white text-md font-semibold mb-3">Subscribe</h3>
            <p className="text-xs mb-3">
              Join our mailing list for updates and offers.
            </p>
            <form className="flex rounded overflow-hidden border border-gray-600 mb-3">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-2 py-2 bg-transparent text-white text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 px-3 text-xs text-white hover:bg-blue-700 transition"
              >
                Join
              </button>
            </form>
            <p className="text-xs">
              Email:{" "}
              <a href="mailto:support@loomi.com" className="hover:text-white">
                kottakalestore@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-4 flex flex-col gap-3 sm:flex-row items-center justify-between text-xs sm:text-sm">
          <p className="text-center sm:text-left">
            &copy; {currentYear} Kottakkal e-Store. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xl text-white">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcAmex />
            <FaPaypal />
          </div>
        </div>
      </div>
    </footer>
  );
}
