import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaShippingFast,
  FaRedo,
  FaShieldAlt,
  FaComments,
} from "react-icons/fa";
import { useProducts } from "../../context/ProductContext";
import { Link } from "react-router-dom";

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
            {/* Main Carousel */}
            <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg p-4 py-8 sm:p-6 md:p-10 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 rounded-lg"></div>

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
                        <div className="relative z-10 text-center md:text-left flex-1">
                          {offer.offerPercentage > 0 && (
                            <span className="text-blue-600 text-2xl sm:text-3xl md:text-5xl font-extrabold block mb-2">
                              {offer.offerPercentage}%{" "}
                              <span className="text-gray-700 text-sm sm:text-base font-normal">
                                Sale Off
                              </span>
                            </span>
                          )}
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2 sm:mb-4">
                            {product.name}
                          </h2>
                          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 max-w-md mx-auto md:mx-0">
                            {product.description}
                          </p>
                          <Link to={`/product/${product._id}`}>
                            <span className="inline-block bg-gray-800 text-white text-sm sm:text-base font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-gray-700 transition-colors duration-300">
                              Shop Now
                            </span>
                          </Link>
                        </div>
                        <div className="relative z-10 w-full sm:w-1/2 md:w-2/5 flex justify-center items-center p-2 sm:p-4">
                          <img
                            src={
                              product.imageUrl ||
                              product.images?.[0]?.url ||
                              "/images/default.png"
                            }
                            alt={product.name}
                            className="max-w-full object-contain drop-shadow-2xl"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>

            {/* Sidebar Cards */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4 sm:gap-6 justify-between">
              {offers
                .filter((offer) => offer.product)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2)
                .map((offer) => {
                  const product = offer.product;
                  const currentPrice = calculateOfferPrice(
                    product.price,
                    offer.offerPercentage
                  );
                  return (
                    <div
                      key={offer._id}
                      className="bg-white rounded-xl shadow-md sm:shadow-xl p-4 sm:p-6 flex items-center justify-between hover:shadow-2xl transition duration-300"
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="text-gray-900 font-semibold text-lg sm:text-2xl mb-1">
                          {product.name}
                        </h3>
                        {offer.limitedTimeOffer && (
                          <p className="text-sm text-red-500 mb-1 font-medium">
                            Limited time offer
                          </p>
                        )}
                        <div className="flex items-baseline space-x-2 sm:space-x-3">
                          <span className="text-indigo-700 font-bold text-lg sm:text-2xl">
                            ${currentPrice.toFixed(2)}
                          </span>
                          {product.price > currentPrice && (
                            <span className="text-gray-400 line-through text-sm sm:text-lg">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                        <img
                          src={
                            product.imageUrl ||
                            product.images?.[0]?.url ||
                            "/images/default.png"
                          }
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <div className="bg-gray-100 py-6 sm:py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                icon: FaShippingFast,
                title: "Free Shipping",
                desc: "For orders over $200",
              },
              {
                icon: FaRedo,
                title: "Easy Returns",
                desc: "15-day money-back",
              },
              {
                icon: FaShieldAlt,
                title: "Secure Payments",
                desc: "Safe & secure checkout",
              },
              {
                icon: FaComments,
                title: "24/7 Support",
                desc: "Help anytime you need",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-3 sm:p-5 flex flex-col items-center text-center hover:shadow-md transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-black text-white p-2 sm:p-3 rounded-full mb-2 sm:mb-3">
                  <service.icon className="text-xl sm:text-2xl" />
                </div>
                <h3 className="font-semibold text-sm sm:text-lg text-black mb-1">
                  {service.title}
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
