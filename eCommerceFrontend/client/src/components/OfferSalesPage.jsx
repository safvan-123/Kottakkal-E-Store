// import React, { useState, useEffect } from "react";
// import { useProducts } from "../context/ProductContext";
// import { BsGridFill, BsList } from "react-icons/bs";
// import ProductCard from "./homepage/needs/ProductCard";
// import Pagination from "./Pagination";

// const PRODUCTS_PER_PAGE = 9;

// const OfferSalesPage = () => {
//   const { offerProducts, loading, error } = useProducts();
//   console.log(offerProducts);

//   const [gridView, setGridView] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Calculate total pages
//   const totalPages = Math.ceil(offerProducts.length / PRODUCTS_PER_PAGE);

//   // Get products for the current page
//   const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
//   const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
//   const paginatedProducts = offerProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Reset to first page if offerProducts change (e.g., after filtering)
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [offerProducts]);

//   if (loading) {
//     return (
//       <div className="offer-sales-page-container flex justify-center items-center h-screen">
//         <p className="text-xl text-gray-700">Loading amazing offers...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="offer-sales-page-container text-center py-10">
//         <p className="error-message text-red-600 font-bold text-lg">
//           Error: {error}
//         </p>
//         <p className="text-gray-600">
//           Please try refreshing the page or check back later.
//         </p>
//       </div>
//     );
//   }

//   if (!offerProducts || offerProducts.length === 0) {
//     return (
//       <div className="offer-sales-page-container text-center py-20">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">
//           No Offers Available Right Now!
//         </h1>
//         <p className="text-lg text-gray-600">
//           Stay tuned for exciting deals coming soon.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="offer-sales-page-container">
//       {/* Hero Section */}
//       <section className="hero-section text-center py-16 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg shadow-lg mb-10">
//         <h1 className="text-5xl font-extrabold mb-4 animate-pulse">
//           ⚡️ Limited Time Offers! ⚡️
//         </h1>
//         <p className="text-xl font-medium">
//           Grab incredible deals before they're gone!
//         </p>
//       </section>

//       <hr className="my-8 border-gray-300" />

//       {/* Product Grid/List and View Toggles */}
//       <section className="product-list-section">
//         <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
//           <h2 className="text-3xl font-bold text-gray-800">
//             Our Exclusive Deals
//           </h2>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setGridView(true)}
//               className={`p-2 rounded-md transition-colors duration-200 ${
//                 gridView
//                   ? "bg-orange-500 text-white shadow-md"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//               aria-label="Toggle Grid View"
//             >
//               <BsGridFill className="text-xl" />
//             </button>
//             <button
//               onClick={() => setGridView(false)}
//               className={`p-2 rounded-md transition-colors duration-200 ${
//                 !gridView
//                   ? "bg-orange-500 text-white shadow-md"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//               aria-label="Toggle List View"
//             >
//               <BsList className="text-xl" />
//             </button>
//           </div>
//         </div>

//         {/* Product Display Area */}
//         <div
//           className={`${
//             gridView
//               ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//               : "flex flex-col gap-4"
//           }`}
//         >
//           {paginatedProducts.map((product) => (
//             <ProductCard
//               key={product._id}
//               product={product.product}
//               isListView={!gridView}
//             />
//           ))}
//         </div>

//         {/* Pagination */}
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </section>

//       <hr className="my-8 border-gray-300" />

//       {/* Call to Action / Urgency Section */}
//       <section className="cta-section text-center py-12 bg-blue-100 rounded-lg shadow-md mb-10">
//         <h2 className="text-4xl font-bold text-blue-800 mb-4">
//           Don't Miss Out!
//         </h2>
//         <p className="text-lg text-gray-700 mb-6">
//           These amazing offers won't last forever. Secure your favorites now!
//         </p>
//         {/* <button className="shop-all-offers-button bg-orange-600 text-white font-semibold py-3 px-8 rounded-full text-lg hover:bg-orange-700 transition-colors duration-300 transform hover:scale-105 shadow-lg">
//           Shop All Offers Now!
//         </button> */}
//       </section>
//     </div>
//   );
// };

// export default OfferSalesPage;

import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { BsGridFill, BsList } from "react-icons/bs";
import ProductCard from "./homepage/needs/ProductCard";
import Pagination from "./Pagination";
import { motion } from "framer-motion";
import { FaBolt, FaClock, FaGift, FaShoppingBag, FaTags } from "react-icons/fa";
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
      {/* <motion.section
        className="text-center py-16 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg shadow-lg mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold mb-4 animate-pulse">
          ⚡️ Limited Time Offers! ⚡️
        </h1>
        <p className="text-xl font-medium">
          Grab incredible deals before they're gone!
        </p>
      </motion.section> */}

      {/* <motion.section
        className="relative text-center py-20 px-4 sm:px-10 bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-500 text-white rounded-2xl shadow-2xl mb-12 overflow-hidden"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-pink-400 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-300 opacity-20 rounded-full filter blur-2xl animate-ping"></div>

        
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-transparent bg-clip-text drop-shadow-lg">
          🛒 ഇന്നത്തെ മികച്ച ഓഫറുകൾ
        </h1>
        <p className="text-lg sm:text-xl text-white/90 font-medium mb-6 max-w-xl mx-auto text-white">
          ഇപ്പോൾ തന്നെ സ്വന്തമാക്കൂ – Limited Time Deals!
        </p>

       
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 px-8 py-3 bg-white text-pink-600 font-semibold text-lg rounded-full shadow-md hover:bg-pink-100 transition-all duration-300"
        >
          Shop Now
        </motion.button>
      </motion.section> */}

      <motion.section
        className="relative text-center py-20 px-4 sm:px-10 bg-gradient-to-br from-purple-800 via-fuchsia-700 to-pink-600 text-white rounded-2xl shadow-2xl mb-12 overflow-hidden"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* Floating Glows */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-pink-400 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-yellow-300 opacity-20 rounded-full filter blur-2xl animate-ping"></div>

        {/* Decorative Icons */}
        <motion.div
          className="absolute top-6 left-6 text-white/30 text-4xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaGift />
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-8 text-white/30 text-3xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FaTags />
        </motion.div>

        <motion.div
          className="absolute top-8 right-8 text-white/30 text-4xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <FaBolt />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-transparent bg-clip-text drop-shadow-lg">
          🛒 ഇന്നത്തെ മികച്ച ഓഫറുകൾ
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/90 font-medium mb-6 max-w-xl mx-auto">
          ഇപ്പോൾ തന്നെ സ്വന്തമാക്കൂ – Limited Time Deals Just for You!
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#fce7f3" }}
          whileTap={{ scale: 0.96 }}
          className="mt-4 px-8 py-3 bg-white text-pink-600 font-semibold text-lg rounded-full shadow-lg hover:bg-pink-100 transition-all duration-300"
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
