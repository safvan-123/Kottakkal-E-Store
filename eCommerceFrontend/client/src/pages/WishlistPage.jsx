// import React, { useEffect, useState } from "react";
// import { useWishlist } from "../context/WishlistContext";
// import { useNavigate } from "react-router-dom";
// import {
//   FaHeart,
//   FaHeartBroken,
//   FaTrash,
//   FaShoppingCart,
// } from "react-icons/fa";
// import { useProducts } from "../context/ProductContext";
// import { useCart } from "../context/CartContext";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";

// const WishlistPage = () => {
//   const { wishlist, removeFromWishlist, loadingWishlist, errorWishlist } =
//     useWishlist();
//   const navigate = useNavigate();
//   const { offerProducts } = useProducts();
//   const { addToCart } = useCart();
//   const [showFallingIcon, setShowFallingIcon] = useState(true);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     const timer = setTimeout(() => setShowFallingIcon(false), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   const formatPrice = (price) => {
//     if (typeof price !== "number" || isNaN(price)) return "N/A";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(price);
//   };

//   const handleRemoveClick = (productId) => {
//     removeFromWishlist(productId);
//     toast.info("Product removed from wishlist!");
//   };

//   const handleProductClick = (productId) => {
//     navigate(`/product/${productId}`);
//   };

//   const handleAddToCart = (product) => {
//     const sizeToAdd = product.sizes?.[0] || "One Size";
//     const colorToAdd = product.colors?.[0] || "Default Color";
//     addToCart(product, 1, sizeToAdd, colorToAdd);
//   };

//   const getDisplayPrice = (product) => {
//     const productOffer = offerProducts.find(
//       (offer) => offer.product?._id === product._id
//     );
//     if (productOffer) {
//       const discountedPrice =
//         product.price - product.price * (productOffer.offerPercentage / 100);
//       return (
//         <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
//           <span className="text-lg sm:text-xl font-extrabold text-blue-600">
//             {formatPrice(discountedPrice)}
//           </span>
//           <span className="text-xs sm:text-sm text-gray-500 line-through">
//             {formatPrice(product.price)}
//           </span>
//           <span className="text-xs font-semibold text-green-500">
//             ({productOffer.offerPercentage}% off)
//           </span>
//         </div>
//       );
//     }

//     return (
//       <span className="text-lg sm:text-xl font-extrabold text-blue-600">
//         {formatPrice(product.price)}
//       </span>
//     );
//   };

//   if (loadingWishlist) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center text-gray-600">
//         <p className="text-lg md:text-xl font-medium">
//           Loading your wishlist...
//         </p>
//         <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//       </div>
//     );
//   }

//   if (errorWishlist) {
//     return (
//       <div className="container mx-auto px-4 py-12 text-center text-red-500">
//         <p className="text-lg md:text-xl font-medium">
//           Error loading wishlist:
//         </p>
//         <p className="text-base md:text-lg mt-2">{errorWishlist}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Falling heart icon */}
//       {showFallingIcon && (
//         <motion.div
//           initial={{ opacity: 1, y: -100, scale: 1 }}
//           animate={{ opacity: 0, y: 300, scale: 1.5 }}
//           transition={{ duration: 2, ease: "easeInOut" }}
//           className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 text-pink-500 text-5xl pointer-events-none"
//         >
//           <FaHeart />
//         </motion.div>
//       )}

//       {/* Page header */}
//       <section className="bg-gradient-to-r from-white via-gray-50 to-white py-5 border-b border-gray-200 shadow-sm">
//         <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-2 sm:space-y-0">
//           <motion.h1
//             initial={{ opacity: 0, x: -30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-lg sm:text-2xl font-bold text-gray-900"
//           >
//             Your Wishlist
//           </motion.h1>

//           <motion.nav
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="text-gray-600 text-sm"
//           >
//             <a
//               href="/"
//               className="hover:text-blue-600 transition-colors duration-300"
//             >
//               Home
//             </a>{" "}
//             / <span className="text-blue-600 font-medium">Wishlist</span>
//           </motion.nav>
//         </div>
//       </section>

//       {/* Wishlist content */}
//       <section className="py-6 bg-gray-100 min-h-screen">
//         <div className="container mx-auto px-4">
//           {wishlist.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg text-center">
//               <FaHeartBroken className="text-gray-400 text-6xl mb-6 animate-pulse" />
//               <p className="text-xl text-gray-700 font-semibold mb-3">
//                 നിങ്ങളുടെ വിസ്‌ലിസ്റ്റ് ഒഴിവാണ്!
//               </p>
//               <p className="text-gray-600 mb-6 max-w-sm text-sm mx-auto">
//                 നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഉൽപ്പന്നങ്ങൾ ഇവിടെ ചേർക്കാം.
//               </p>
//               <button
//                 onClick={() => navigate("/shop")}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:scale-105 transition transform duration-300 text-sm"
//               >
//                 ഷോപ്പിലേക്ക് പോകൂ
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//                 {wishlist.map((product, index) => (
//                   <motion.div
//                     key={product._id}
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: index * 0.05 }}
//                     whileHover={{ scale: 1.02 }}
//                     className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
//                   >
//                     <div className="relative overflow-hidden">
//                       <motion.img
//                         whileHover={{ scale: 1.05 }}
//                         src={
//                           product.imageUrl ||
//                           product.images?.[0]?.url ||
//                           "https://via.placeholder.com/400x400?text=No+Image"
//                         }
//                         alt={product.name}
//                         className="w-full h-40 sm:h-48 md:h-56 object-contain bg-white cursor-pointer transition-transform duration-300 py-2"
//                         onClick={() => handleProductClick(product._id)}
//                       />
//                       <button
//                         onClick={() => handleRemoveClick(product._id)}
//                         className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition duration-300 shadow-md"
//                         title="Remove from Wishlist"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>

//                     <div className="p-3 flex-1 flex flex-col justify-between">
//                       <h3
//                         onClick={() => handleProductClick(product._id)}
//                         className="text-sm font-semibold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 mb-2"
//                         title={product.name}
//                       >
//                         {product.name}
//                       </h3>

//                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-2 gap-2">
//                         {getDisplayPrice(product)}
//                         <motion.button
//                           whileTap={{ scale: 0.95 }}
//                           onClick={() => handleAddToCart(product)}
//                           className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-md px-4 py-2 text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
//                         >
//                           <FaShoppingCart className="mr-2" />
//                           <span className="hidden sm:inline">Add to Cart</span>
//                           <span className="sm:hidden">Cart</span>
//                         </motion.button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default WishlistPage;

import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaHeartBroken,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loadingWishlist, errorWishlist } =
    useWishlist();
  const navigate = useNavigate();
  const { offerProducts } = useProducts();
  const { addToCart } = useCart();
  const [showFallingIcons, setShowFallingIcons] = useState(true);
  const heartColors = [
    "text-red-500",
    "text-rose-500",
    "text-pink-500",
    "text-fuchsia-500",
    "text-violet-500",
    "text-rose-400",
  ];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => setShowFallingIcons(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleRemoveClick = (productId) => {
    removeFromWishlist(productId);
    toast.info("Product removed from wishlist!");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    const sizeToAdd = product.sizes?.[0] || "One Size";
    const colorToAdd = product.colors?.[0] || "Default Color";
    addToCart(product, 1, sizeToAdd, colorToAdd);
  };

  const getDisplayPrice = (product) => {
    const productOffer = offerProducts.find(
      (offer) => offer.product?._id === product._id
    );
    if (productOffer) {
      const discountedPrice =
        product.price - product.price * (productOffer.offerPercentage / 100);
      return (
        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
          <span className="text-lg sm:text-xl font-extrabold text-blue-600">
            {formatPrice(discountedPrice)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 line-through">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs font-semibold text-green-500">
            ({productOffer.offerPercentage}% off)
          </span>
        </div>
      );
    }

    return (
      <span className="text-lg sm:text-xl font-extrabold text-blue-600">
        {formatPrice(product.price)}
      </span>
    );
  };

  // const renderFallingHearts = () => {
  //   const hearts = [];
  //   for (let i = 0; i < 25; i++) {
  //     const left = Math.random() * 100;
  //     const delay = Math.random() * 1;
  //     hearts.push(
  //       <motion.div
  //         key={i}
  //         initial={{ y: -100, opacity: 1 }}
  //         animate={{ y: 600, opacity: 0 }}
  //         transition={{
  //           duration: 2.5,
  //           ease: "easeInOut",
  //           delay: delay,
  //         }}
  //         className="fixed text-pink-500 text-2xl sm:text-3xl lg:text-4xl pointer-events-none z-50"
  //         style={{ left: `${left}%`, top: "-20px" }}
  //       >
  //         <FaHeart />
  //       </motion.div>
  //     );
  //   }
  //   return hearts;
  // };

  const renderFallingHearts = () => {
    const hearts = [];
    for (let i = 0; i < 35; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 1;
      const colorClass =
        heartColors[Math.floor(Math.random() * heartColors.length)];

      hearts.push(
        <motion.div
          key={i}
          initial={{ y: -100, opacity: 1 }}
          animate={{ y: 600, opacity: 0 }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            delay: delay,
          }}
          className={`fixed ${colorClass} text-2xl sm:text-3xl lg:text-4xl pointer-events-none z-50`}
          style={{ left: `${left}%`, top: "-20px" }}
        >
          <FaHeart />
        </motion.div>
      );
    }
    return hearts;
  };
  if (loadingWishlist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-600">
        <p className="text-lg md:text-xl font-medium">
          Loading your wishlist...
        </p>
        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (errorWishlist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <p className="text-lg md:text-xl font-medium">
          Error loading wishlist:
        </p>
        <p className="text-base md:text-lg mt-2">{errorWishlist}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Multiple Falling Heart Icons */}
      {showFallingIcons && renderFallingHearts()}

      {/* Page header */}

      {/* <section className="relative bg-gradient-to-r from-pink-500 via-red-400 to-rose-500 py-6 shadow-md text-white rounded-b-xl overflow-hidden">
        <div className="absolute -top-5 -left-5 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-ping"></div>

        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-y-3">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-3xl font-extrabold tracking-wide flex items-center gap-2"
          >
            <FaHeart className="text-white animate-bounce" />
            Your WishList
          </motion.h1>

          <motion.nav
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm sm:text-base text-white/90"
          >
            <a
              href="/"
              className="hover:underline hover:text-yellow-300 transition duration-300"
            >
              Home
            </a>{" "}
            / <span className="font-medium text-white">WishList</span>
          </motion.nav>
        </div>
      </section> */}
      <section className="relative bg-gradient-to-r from-[#7F00FF] via-[#E100FF] to-[#FF5E99] py-6 shadow-lg text-white rounded-b-xl overflow-hidden">
        {/* Animated glowing orbs */}
        <div className="absolute -top-5 -left-5 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-ping"></div>

        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-y-3">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-3xl font-extrabold tracking-wide flex items-center gap-2"
          >
            <FaHeart className="text-white animate-bounce drop-shadow-md" />
            Your WishList
          </motion.h1>

          <motion.nav
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm sm:text-base text-white/90"
          >
            <a
              href="/"
              className="hover:underline hover:text-yellow-300 transition duration-300"
            >
              Home
            </a>{" "}
            / <span className="font-medium text-white">WishList</span>
          </motion.nav>
        </div>
      </section>

      {/* Wishlist content */}
      <section className="py-6 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg text-center">
              <FaHeartBroken className="text-gray-400 text-6xl mb-6 animate-pulse" />
              <p className="text-xl text-gray-700 font-semibold mb-3">
                നിങ്ങളുടെ വിസ്‌ലിസ്റ്റ് ഒഴിവാണ്!
              </p>
              <p className="text-gray-600 mb-6 max-w-sm text-sm mx-auto">
                നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഉൽപ്പന്നങ്ങൾ ഇവിടെ ചേർക്കാം.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:scale-105 transition transform duration-300 text-sm"
              >
                ഷോപ്പിലേക്ക് പോകൂ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={
                        product.imageUrl ||
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/400x400?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-40 sm:h-48 md:h-56 object-contain bg-white cursor-pointer transition-transform duration-300 py-2"
                      onClick={() => handleProductClick(product._id)}
                    />
                    <button
                      onClick={() => handleRemoveClick(product._id)}
                      className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition duration-300 shadow-md"
                      title="Remove from Wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <h3
                      onClick={() => handleProductClick(product._id)}
                      className="text-sm font-semibold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 mb-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-2 gap-2">
                      {getDisplayPrice(product)}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-md px-4 py-2 text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
                      >
                        <FaShoppingCart className="mr-2" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Cart</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WishlistPage;
