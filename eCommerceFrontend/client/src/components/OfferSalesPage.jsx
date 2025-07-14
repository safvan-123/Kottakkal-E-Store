import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { BsGridFill, BsList } from "react-icons/bs";
import ProductCard from "./homepage/needs/ProductCard";
import Pagination from "./Pagination";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaClock,
  FaFire,
  FaGift,
  FaShoppingBag,
  FaTags,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PRODUCTS_PER_PAGE = 9;

const OfferSalesPage = () => {
  const navigate = useNavigate();
  const { offerProducts, loading, error } = useProducts();
  const [gridView, setGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(offerProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const paginatedProducts = offerProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [offerProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-xl text-gray-700 animate-pulse">
          Loading amazing offers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600 font-bold text-lg">
        Error: {error}
        <p className="text-gray-600">
          Please try refreshing the page or check back later.
        </p>
      </div>
    );
  }

  if (!offerProducts || offerProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          No Offers Available Right Now!
        </h1>
        <p className="text-lg text-gray-600">
          Stay tuned for exciting deals coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-10">
      {/* Hero Section */}

      <motion.section
        className="relative text-center py-12 sm:py-16 px-4 sm:px-8 bg-gradient-to-br from-purple-800 via-fuchsia-700 to-pink-600 text-white rounded-2xl shadow-2xl mb-10 overflow-hidden"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Floating Glows */}
        <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 bg-pink-400 opacity-20 rounded-full filter blur-2xl animate-pulse"></div>
        <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-300 opacity-20 rounded-full filter blur-2xl animate-ping"></div>

        {/* Icons */}
        <motion.div
          className="pointer-events-none absolute top-4 left-4 text-white/30 text-3xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaGift />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-6 left-6 text-white/30 text-2xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FaTags />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute top-6 right-6 text-white/30 text-3xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <FaBolt />
        </motion.div>

        <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 tracking-tight flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-transparent bg-clip-text drop-shadow-lg">
          <div className="flex items-center justify-center gap-1 me-4 sm:me-0">
            <FaGift className="text-yellow-300 drop-shadow-lg text-2xl sm:text-4xl" />
            <FaFire className="text-pink-400 drop-shadow-lg text-2xl sm:text-4xl" />
            <span className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-transparent bg-clip-text">
              ഇന്നത്തെ മികച്ച ഓഫറുകൾ
            </span>
          </div>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/90 font-medium mb-5 max-w-xl mx-auto">
          ഇപ്പോൾ തന്നെ സ്വന്തമാക്കൂ – Limited Time Deals Just for You!
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#fce7f3" }}
          whileTap={{ scale: 0.96 }}
          className="relative z-10 mt-2 px-6 py-2 sm:px-8 sm:py-3 bg-white text-pink-600 font-semibold text-base sm:text-lg rounded-full shadow-lg hover:bg-pink-100 transition-all duration-300"
          onClick={() => navigate("/shop")}
        >
          🛍️ Shop Now
        </motion.button>
      </motion.section>

      {/* View Toggle & Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Our Exclusive Deals
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setGridView(true)}
            className={`p-2 rounded-md transition duration-200 ${
              gridView
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Grid View"
          >
            <BsGridFill className="text-xl" />
          </button>
          <button
            onClick={() => setGridView(false)}
            className={`p-2 rounded-md transition duration-200 ${
              !gridView
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="List View"
          >
            <BsList className="text-xl" />
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <motion.div
        className={`${
          gridView
            ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {paginatedProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product.product} isListView={!gridView} />
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Call to Action */}
    </div>
  );
};

export default OfferSalesPage;
