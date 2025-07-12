// import React, { useEffect } from "react";
// import { useWishlist } from "../context/WishlistContext";
// import { useNavigate } from "react-router-dom";
// import { FaHeartBroken, FaTrash, FaShoppingCart } from "react-icons/fa";
// import { useProducts } from "../context/ProductContext";
// import { useCart } from "../context/CartContext";
// import { toast } from "react-toastify";

// const WishlistPage = () => {
//   const { wishlist, removeFromWishlist, loadingWishlist, errorWishlist } =
//     useWishlist();
//   const navigate = useNavigate();
//   const { offerProducts } = useProducts();
//   const { addToCart } = useCart();

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
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
//     const sizeToAdd =
//       product.sizes && product.sizes.length > 0 ? product.sizes[0] : "One Size";
//     const colorToAdd =
//       product.colors && product.colors.length > 0
//         ? product.colors[0]
//         : "Default Color";

//     addToCart(product, 1, sizeToAdd, colorToAdd);
//   };

//   // Function to determine which price to display
//   const getDisplayPrice = (product) => {
//     const productOffer = offerProducts.find(
//       (offer) => offer.product?._id === product._id
//     );

//     if (productOffer) {
//       const discountedPrice =
//         product.price - product.price * (productOffer.offerPercentage / 100);

//       return (
//         <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
//           <span className="text-xl md:text-2xl font-extrabold text-blue-600">
//             {formatPrice(discountedPrice)}
//           </span>
//           <span className="text-sm text-gray-500 line-through">
//             {formatPrice(product.price)}
//           </span>
//           <span className="text-xs md:text-sm font-semibold text-green-500">
//             ({productOffer.offerPercentage}% off)
//           </span>
//         </div>
//       );
//     }

//     return (
//       <span className="text-xl md:text-2xl font-extrabold text-blue-600">
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
//           className="mt-6 px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Page Header */}
//       <section className="bg-white py-6 md:py-8 border-b border-gray-200 shadow-sm">
//         <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
//             Your Wishlist
//           </h1>
//           <nav className="text-gray-600 text-sm">
//             <a href="/" className="hover:text-blue-600 transition-colors">
//               Home
//             </a>{" "}
//             / <span className="text-blue-600">Wishlist</span>
//           </nav>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="py-8 md:py-12 bg-gray-100 min-h-screen">
//         <div className="container mx-auto px-4">
//           {wishlist.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-10 md:py-20 bg-white rounded-xl shadow-lg text-center">
//               <FaHeartBroken className="text-gray-400 text-6xl md:text-7xl mb-4 md:mb-6" />
//               <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-3 md:mb-4">
//                 Your wishlist is empty!
//               </p>
//               <p className="text-gray-600 mb-6 md:mb-8 max-w-xs sm:max-w-md mx-auto text-sm md:text-base">
//                 Start Browse and add your favorite products here. They'll be
//                 waiting for you.
//               </p>
//               <button
//                 onClick={() => navigate("/shop")}
//                 className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-sm md:text-base"
//               >
//                 Go to Shop Now
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
//               {wishlist.map((product) => (
//                 <div
//                   key={product._id}
//                   className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
//                 >
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={
//                         product.imageUrl ||
//                         product.images?.[0]?.url ||
//                         "https://via.placeholder.com/400x400?text=No+Image"
//                       }
//                       alt={product.name}
//                       className="w-full h-48 sm:h-56 md:h-64 object-contain bg-white cursor-pointer transition-transform duration-300 hover:scale-105 p-2"
//                       onClick={() => handleProductClick(product._id)}
//                     />

//                     <button
//                       onClick={() => handleRemoveClick(product._id)}
//                       className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 text-base md:text-lg opacity-90 hover:opacity-100 hover:bg-red-700 transition-all duration-300 z-10 shadow-md"
//                       aria-label={`Remove ${product.name} from Wishlist`}
//                       title="Remove from Wishlist"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>

//                   <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
//                     <div>
//                       <h3
//                         onClick={() => handleProductClick(product._id)}
//                         className="text-base sm:text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 leading-tight mb-2"
//                         title={product.name}
//                       >
//                         {product.name}
//                       </h3>
//                     </div>
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-2 gap-2">
//                       {/* --- Price Display Area --- */}
//                       {getDisplayPrice(product)}
//                       <button
//                         onClick={() => handleAddToCart(product)}
//                         className="bg-blue-600 text-white rounded-lg p-2.5 text-sm md:text-base hover:bg-blue-700 transition duration-300 flex items-center justify-center shadow-md w-full sm:w-auto mt-2 sm:mt-0"
//                         aria-label={`Add ${product.name} to cart`}
//                         title="Add to Cart"
//                       >
//                         <FaShoppingCart className="mr-1 sm:mr-2" />
//                         <span className="hidden sm:inline">Cart</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default WishlistPage;

import React, { useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { FaHeartBroken, FaTrash, FaShoppingCart } from "react-icons/fa";
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-blue-600">
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
      <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-blue-600">
        {formatPrice(product.price)}
      </span>
    );
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
          className="mt-6 px-5 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* <section className="bg-white py-6 md:py-8 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
            Your Wishlist
          </h1>
          <nav className="text-gray-600 text-sm">
            <a href="/" className="hover:text-blue-600 transition-colors">
              Home
            </a>{" "}
            / <span className="text-blue-600">Wishlist</span>
          </nav>
        </div>
      </section> */}

      <section className="bg-gradient-to-r from-white via-gray-50 to-white py-5 md:py-8 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-2 sm:space-y-0">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900"
          >
            Your Wishlist
          </motion.h1>

          <motion.nav
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 text-sm sm:text-base"
          >
            <a
              href="/"
              className="hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </a>{" "}
            / <span className="text-blue-600 font-medium">Wishlist</span>
          </motion.nav>
        </div>
      </section>
      <section className="py-6 md:py-12 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-20 bg-white rounded-xl shadow-lg text-center">
              <FaHeartBroken className="text-gray-400 text-6xl md:text-7xl mb-4 md:mb-6" />
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold mb-3 md:mb-4">
                Your wishlist is empty!
              </p>
              <p className="text-gray-600 mb-6 md:mb-8 max-w-xs sm:max-w-md mx-auto text-sm md:text-base">
                Start browsing and add your favorite products here.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:scale-105 transition transform duration-300 text-sm md:text-base"
              >
                Go to Shop Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {wishlist.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      src={
                        product.imageUrl ||
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/400x400?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-50 sm:h-48 md:h-56 lg:h-64 object-contain bg-white cursor-pointer transition-transform duration-300 py-2"
                      onClick={() => handleProductClick(product._id)}
                    />
                    <button
                      onClick={() => handleRemoveClick(product._id)}
                      className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 text-sm md:text-base hover:bg-red-700 transition duration-300 shadow-md"
                      title="Remove from Wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => handleProductClick(product._id)}
                        className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug mb-2"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto pt-2 gap-2">
                      {getDisplayPrice(product)}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg px-4 py-2 text-sm md:text-base hover:shadow-xl transition-all duration-300 flex items-center justify-center w-full sm:w-auto mt-2 sm:mt-0"
                        title="Add to Cart"
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
