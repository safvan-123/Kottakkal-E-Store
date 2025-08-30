import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrashAlt,
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// 🔹 Mobile-friendly SweetAlert wrapper
const showAlert = (options) => {
  return MySwal.fire({
    ...options,
    width: window.innerWidth < 480 ? "90%" : "400px", // ✅ smaller width on mobile
    customClass: {
      popup: "rounded-xl text-sm md:text-base",
      confirmButton: "px-4 py-2 text-sm md:text-base",
      cancelButton: "px-4 py-2 text-sm md:text-base",
    },
  });
};

const CartPage = () => {
  const {
    cartItems,
    cartTotal,
    loadingCart,
    cartError,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  // ✅ Handle increase/decrease with SweetAlert
  const handleQuantity = (id, quantity, type) => {
    const newQty = type === "increase" ? quantity + 1 : quantity - 1;
    if (newQty < 1) {
      showAlert({
        title: "Remove this item?",
        text: "This product will be deleted from your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, remove it!",
      }).then((result) => {
        if (result.isConfirmed) {
          removeFromCart(id);
          showAlert({
            title: "Removed!",
            text: "Item has been removed from your cart.",
            icon: "success",
          });
        }
      });
    } else {
      updateCartQuantity(id, newQty);
    }
  };

  // ✅ Handle single item remove with SweetAlert
  const handleRemoveItem = (id) => {
    showAlert({
      title: "Are you sure?",
      text: "Do you really want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id);
        showAlert({
          title: "Removed!",
          text: "Item has been deleted from your cart.",
          icon: "success",
        });
      }
    });
  };

  // ✅ Loading state
  if (loadingCart)
    return (
      <div className="text-center py-20 text-gray-500">Loading cart...</div>
    );

  // ✅ Error state
  if (cartError)
    return (
      <div className="text-center py-20 text-red-500">Error: {cartError}</div>
    );

  // ✅ Empty cart state
  if (cartItems.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="text-6xl mb-4 animate-bounce">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Go to Shop
        </Link>
      </motion.div>
    );

  // ✅ Main cart page
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      {/* Animated Heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center mb-8 text-center"
      >
        <FaShoppingCart className="text-xl sm:text-2xl text-blue-600 mr-2 animate-pulse" />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Items in Your Bag 🛍️
        </h1>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items Section */}
        <div className="w-full lg:w-full grid grid-cols-2 gap-4 sm:gap-6">
          {cartItems.map(
            ({ _id, product, quantity, size, color, subTotal }) => {
              const hasOffer =
                product.offerPrice && product.offerPrice < product.price;

              return (
                <motion.div
                  key={_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 shadow rounded-xl p-2 sm:p-3 flex flex-col gap-2 hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${product._id}`}
                    className="w-full h-32 sm:h-44 rounded-lg overflow-hidden bg-gray-100 relative flex justify-center"
                  >
                    <img
                      src={product.imageUrl || "/images/default-product.png"}
                      alt={product.name}
                      className="w-30 h-full object-cover object-center"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between text-sm">
                    <div>
                      <Link
                        to={`/product/${product._id}`}
                        className="font-semibold text-gray-800 hover:text-blue-600 block truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Size: {size}
                      </p>

                      {color && color !== "Default Color" && (
                        <p className="text-gray-500 mt-0.5 flex items-center">
                          Color:
                          <span
                            className="ml-2 w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></span>
                          <span className="ml-2 capitalize">{color}</span>
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {hasOffer ? (
                          <>
                            <span className="text-green-600 font-semibold">
                              {formatPrice(product.offerPrice)}
                            </span>
                            <span className="line-through text-gray-400 text-xs">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              {product.appliedOfferPercentage}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-800 font-semibold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity + Delete */}
                    <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                      <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                        <button
                          onClick={() =>
                            handleQuantity(_id, quantity, "decrease")
                          }
                        >
                          <FaMinus size={10} className="text-gray-600" />
                        </button>
                        <span className="px-2 text-sm">{quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantity(_id, quantity, "increase")
                          }
                        >
                          <FaPlus size={10} className="text-gray-600" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between w-full mt-2">
                        <span className="font-semibold text-gray-800 text-sm">
                          {formatPrice(subTotal)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(_id)} // ✅ SweetAlert confirm
                          className="p-1 rounded-md hover:bg-red-100 transition text-red-600"
                          title="Remove"
                        >
                          <FaTrash className="text-base sm:text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}

          {/* ✅ Clear Cart Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              showAlert({
                title: "Clear entire cart?",
                text: "This will remove all items from your cart.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, clear it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  clearCart();
                  showAlert({
                    title: "Cleared!",
                    text: "Your cart is now empty.",
                    icon: "success",
                  });
                }
              });
            }}
            className="col-span-2 mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 transition"
          >
            <FaTrashAlt />
            Clear Cart
          </motion.button>
        </div>

        {/* ✅ Order Summary */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full lg:w-1/2 bg-white border border-gray-200 p-5 rounded-xl shadow-md h-fit"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
          <div className="space-y-2 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between border-t pt-3 font-bold text-base text-gray-800">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
          >
            Proceed to Checkout
          </button>
          <Link
            to="/shop"
            className="mt-4 block text-center text-blue-600 hover:underline text-sm"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
