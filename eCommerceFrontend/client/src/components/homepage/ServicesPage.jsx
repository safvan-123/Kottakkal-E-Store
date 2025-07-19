import React from "react";
import {
  FaShippingFast,
  FaRedo,
  FaShieldAlt,
  FaComments,
  FaClock,
  FaShoppingBag,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();
  const services = [
    {
      icon: FaShippingFast,
      title: "Superfast Delivery",
      desc: "Delivered to your doorstep in 24-48 hrs",
    },
    {
      icon: FaRedo,
      title: "Easy Returns",
      desc: "7-day hassle-free return policy",
    },
    {
      icon: FaShieldAlt,
      title: "100% Secure Payments",
      desc: "Encrypted & protected checkout",
    },
    {
      icon: FaComments,
      title: "Customer Support",
      desc: "We’re here 24/7 to help you anytime",
    },
  ];
  return (
    <div>
      {" "}
      <div className="bg-gradient-to-b from-white to-gray-50 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-8 sm:mb-12"
          >
            Why Shop With Us?
          </motion.h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg p-4 sm:p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="bg-indigo-100 text-indigo-600 p-3 sm:p-4 rounded-full mb-3 animate-pulse-slow">
                  <service.icon className="text-lg sm:text-2xl" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.section
        className="relative text-center py-10 sm:py-16 px-3 sm:px-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl my-8 sm:my-12 text-white overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
      >
        {/* Floating Icon Decorations */}
        <motion.div
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/30 text-3xl sm:text-4xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaClock />
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white/30 text-3xl sm:text-4xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaShoppingBag />
        </motion.div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4 drop-shadow-md">
          ⏰ Don't Miss Out!!
        </h2>

        {/* Subheading */}
        <p className="text-sm sm:text-xl text-white/90 max-w-sm sm:max-w-xl mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
          🌟🛍️ മലപ്പുറത്തിന്റെ സ്വന്തം ഓൺലൈൻ സ്റ്റോർ! 🎁 ദിവസേന മികച്ച ഓഫറുകൾ 💥
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          className="mt-3 sm:mt-4 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-indigo-600 font-semibold text-sm sm:text-lg rounded-full shadow-lg hover:bg-indigo-100 transition-all duration-300"
          onClick={() => navigate("/shop")}
        >
          🛒 ഇപ്പോൾ തന്നെ ഷോപ്പുചെയ്യൂ
        </motion.button>
      </motion.section>
    </div>
  );
};

export default ServicesPage;
