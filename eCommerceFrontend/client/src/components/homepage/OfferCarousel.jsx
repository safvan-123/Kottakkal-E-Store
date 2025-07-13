// import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import { motion } from "framer-motion";

// const OfferCarousel = ({
//   offers,
//   calculateOfferPrice,
//   mainHeroCarouselSettings,
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="w-full lg:w-2/3 bg-white rounded-3xl shadow-xl p-4 py-10 sm:p-6 md:p-10 relative overflow-hidden flex flex-col justify-center"
//     >
//       {/* Background gradient layer */}
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 opacity-10 rounded-3xl z-0" />

//       <Slider {...mainHeroCarouselSettings}>
//         {offers.map((offer) => {
//           const product = offer.product;
//           if (!product) return null;

//           const currentPrice = calculateOfferPrice(
//             product.price,
//             offer.offerPercentage
//           );

//           return (
//             <div key={offer._id}>
//               <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-10">
//                 {/* Text Section */}
//                 <motion.div
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="relative z-10 text-center md:text-left flex-1"
//                 >
//                   {/* Offer Badge */}
//                   {offer.offerPercentage > 0 && (
//                     <motion.div
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       transition={{ duration: 0.4 }}
//                       className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-1 rounded-full text-sm sm:text-base font-bold mb-3"
//                     >
//                       🔥 {offer.offerPercentage}% OFF
//                     </motion.div>
//                   )}

//                   <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-2 sm:mb-4">
//                     {product.name}
//                   </h2>
//                   <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto md:mx-0">
//                     {product.description}
//                   </p>

//                   {/* Price and Button */}
//                   <div className="flex justify-center md:justify-start items-center gap-4 mb-4">
//                     <span className="text-indigo-700 text-lg sm:text-xl font-semibold">
//                       ₹{currentPrice.toFixed(2)}
//                     </span>
//                     {product.price > currentPrice && (
//                       <span className="text-gray-400 line-through text-sm">
//                         ₹{product.price.toFixed(2)}
//                       </span>
//                     )}
//                   </div>

//                   <Link to={`/product/${product._id}`}>
//                     <motion.span
//                       whileTap={{ scale: 0.95 }}
//                       className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium shadow-md transition-all duration-300"
//                     >
//                       Shop Now →
//                     </motion.span>
//                   </Link>
//                 </motion.div>

//                 {/* Product Image */}
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="relative z-10 w-full sm:w-1/2 md:w-2/5 flex justify-center items-center p-3 sm:p-4"
//                 >
//                   <img
//                     src={
//                       product.imageUrl ||
//                       product.images?.[0]?.url ||
//                       "/images/default.png"
//                     }
//                     alt={product.name}
//                     className="w-full h-auto max-h-56 object-contain rounded-xl shadow-lg"
//                   />
//                 </motion.div>
//               </div>
//             </div>
//           );
//         })}
//       </Slider>
//     </motion.div>
//   );
// };

// export default OfferCarousel;

import { Link } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";

const OfferCarousel = ({
  offers,
  calculateOfferPrice,
  mainHeroCarouselSettings,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full lg:w-2/3 bg-white rounded-3xl shadow-xl p-4 py-8 sm:p-6 md:p-10 relative overflow-hidden flex flex-col justify-center"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-pink-500 opacity-10 rounded-3xl z-0" />

      <Slider {...mainHeroCarouselSettings}>
        {offers.map((offer) => {
          const product = offer.product;
          if (!product) return null;

          const currentPrice = calculateOfferPrice(
            product.price,
            offer.offerPercentage
          );

          return (
            <div key={offer._id}>
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-10">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 text-center md:text-left flex-1"
                >
                  {/* Animated Offer Badge */}
                  {offer.offerPercentage > 0 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="inline-block bg-gradient-to-r from-pink-600 to-red-500 text-white px-4 py-1 rounded-full text-sm sm:text-base font-bold mb-3 animate-pulse"
                    >
                      🎉 {offer.offerPercentage}% OFF
                    </motion.div>
                  )}

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-2 sm:mb-4">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto md:mx-0">
                    {product.description}
                  </p>

                  {/* Price + Action Button */}
                  <div className="flex justify-center md:justify-start items-center gap-3 mb-4">
                    <span className="text-indigo-700 text-lg sm:text-xl font-semibold">
                      ₹{currentPrice.toFixed(2)}
                    </span>
                    {product.price > currentPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Link to={`/product/${product._id}`}>
                    <motion.span
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium shadow-md transition-all duration-300"
                    >
                      Shop Now →
                    </motion.span>
                  </Link>
                </motion.div>

                {/* Product Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 w-full sm:w-1/2 md:w-2/5 flex justify-center items-center p-3 sm:p-4"
                >
                  <motion.img
                    src={
                      product.imageUrl ||
                      product.images?.[0]?.url ||
                      "/images/default.png"
                    }
                    alt={product.name}
                    whileHover={{ y: -5 }}
                    className="w-full h-auto max-h-56 object-contain rounded-xl shadow-lg transition-all duration-500 ease-in-out"
                  />
                </motion.div>
              </div>
            </div>
          );
        })}
      </Slider>
    </motion.div>
  );
};

export default OfferCarousel;
