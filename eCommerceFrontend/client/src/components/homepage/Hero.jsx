import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useProducts } from "../../context/ProductContext";
import { motion } from "framer-motion";
import OfferCarousel from "./OfferCarousel";

const Hero = () => {
  const { offerProducts, loading, error } = useProducts();
  const offers = Array.isArray(offerProducts) ? offerProducts : [];

  const mainHeroCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    fade: true,
    cssEase: "ease-in-out",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 sm:h-96 bg-gray-100">
        <p className="text-gray-600 text-lg">Loading amazing offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-60 sm:h-96 bg-red-100 text-red-700 p-4 rounded">
        <p>
          Error displaying offers:{" "}
          {error.message || "An unknown error occurred"}
        </p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex justify-center items-center h-60 sm:h-96 bg-gray-100">
        <p className="text-gray-600 text-lg">
          No current special offers available.
        </p>
      </div>
    );
  }

  const calculateOfferPrice = (price, offerPercentage) =>
    price - (price * offerPercentage) / 100;

  return (
    <>
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-6 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 ">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-12 items-stretch">
            <OfferCarousel
              offers={offers}
              calculateOfferPrice={calculateOfferPrice}
              mainHeroCarouselSettings={mainHeroCarouselSettings}
            />
            {/* Sidebar Cards */}

            <div className="hidden lg:flex w-full lg:w-1/3 flex-col gap-4 sm:gap-6 justify-between">
              {offers
                .filter((offer) => offer.product)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map((offer, index) => {
                  const product = offer.product;
                  const currentPrice = calculateOfferPrice(
                    product.price,
                    offer.offerPercentage
                  );

                  return (
                    <motion.div
                      key={offer._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.03 }}
                      className="relative border border-gray-200 rounded-2xl shadow-md hover:shadow-xl p-4 sm:p-6 flex items-center justify-between transition-all duration-300"
                    >
                      {/* Gradient border effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 opacity-20 -z-10" />

                      <div className="flex-1 pr-4">
                        <h3 className="text-gray-900 font-semibold text-base sm:text-xl mb-1">
                          {product.name}
                        </h3>

                        {offer.limitedTimeOffer && (
                          <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded mb-2">
                            ⏰ Limited Time
                          </span>
                        )}

                        <div className="flex items-baseline space-x-2 sm:space-x-3 mt-1">
                          <span className="text-indigo-700 font-bold text-lg sm:text-2xl">
                            ₹{currentPrice.toFixed(2)}
                          </span>
                          {product.price > currentPrice && (
                            <span className="text-gray-400 line-through text-sm sm:text-lg">
                              ₹{product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center"
                      >
                        <img
                          src={
                            product.imageUrl ||
                            product.images?.[0]?.url ||
                            "/images/default.png"
                          }
                          alt={product.name}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
