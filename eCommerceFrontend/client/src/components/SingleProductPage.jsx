import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCategory } from "../context/CategoryContext";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaTag,
  FaRulerCombined,
  FaPalette,
  FaShoppingCart,
  FaSpinner,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useWishlist } from "../context/WishlistContext";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/product`;

const SingleProductPage = () => {
  const { productId } = useParams();

  const navigate = useNavigate();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");

  const { categories } = useCategory();
  const { offerProducts } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/${productId}`);

        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setMainImage(fetchedProduct.images[0].url);
        } else if (fetchedProduct.imageUrl) {
          setMainImage(fetchedProduct.imageUrl);
        } else {
          setMainImage("/images/default-product.png");
        }

        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        } else {
          setSelectedSize("One Size");
        }

        if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
          setSelectedColor(fetchedProduct.colors[0]);
        } else {
          setSelectedColor("Default Color");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  // Helper to determine text color for contrast on colored buttons
  const isLightColor = (color) => {
    if (!color || typeof color !== "string") return true;
    const namedColors = {
      black: "#000000",
      white: "#FFFFFF",
      red: "#FF0000",
      green: "#008000",
      blue: "#0000FF",
      yellow: "#FFFF00",
      cyan: "#00FFFF",
      magenta: "#FF00FF",
      gray: "#808080",
      maroon: "#800000",
      olive: "#808000",
      purple: "#800080",
      teal: "#008080",
      navy: "#000080",
      silver: "#C0C0C0",
      gold: "#FFD700",
      orange: "#FFA500",
      pink: "#FFC0CB",
      brown: "#A52A2A",
      violet: "#EE82EE",
      indigo: "#4B0082",
    };

    let hexColor = color.startsWith("#")
      ? color
      : namedColors[color.toLowerCase()];

    if (!hexColor) {
      return false;
    }

    if (hexColor.startsWith("#")) {
      let r, g, b;
      if (hexColor.length === 4) {
        r = parseInt(hexColor[1] + hexColor[1], 16);
        g = parseInt(hexColor[2] + hexColor[2], 16);
        b = parseInt(hexColor[3] + hexColor[3], 16);
      } else if (hexColor.length === 7) {
        r = parseInt(hexColor.substring(1, 3), 16);
        g = parseInt(hexColor.substring(3, 5), 16);
        b = parseInt(hexColor.substring(5, 7), 16);
      } else {
        return false;
      }

      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 170;
    }
    return false;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-120px)] bg-gray-50">
        <FaSpinner className="animate-spin text-blue-600 text-5xl" />
        <div className="ml-4 text-xl text-gray-700 font-semibold">
          Loading product details...
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] bg-gray-50 p-4">
        <div className="text-xl text-red-600 font-semibold mb-4">{error}</div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go to Homepage
        </button>
      </div>
    );
  if (!product)
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-120px)] bg-gray-50 p-4">
        <div className="text-xl text-gray-700 font-semibold mb-4">
          Product not found.
        </div>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          View All Products
        </button>
      </div>
    );

  const currentOffer = Array.isArray(offerProducts)
    ? offerProducts.find((offer) => offer.product?._id === product._id)
    : undefined;

  const calculateOfferPrice = (price, percentage) => {
    return price - (price * percentage) / 100;
  };

  const displayPrice = currentOffer
    ? calculateOfferPrice(product.price, currentOffer.offerPercentage)
    : product.price;

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const categoryName =
    typeof product.category === "string"
      ? getCategoryName(product.category)
      : product.category?.name || "Uncategorized";

  const handleAddToCart = () => {
    if (
      product.sizes &&
      product.sizes.length > 0 &&
      selectedSize === "One Size"
    ) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    if (
      product.colors &&
      product.colors.length > 0 &&
      selectedColor === "Default Color"
    ) {
      toast.error("Please select a color before adding to cart.");
      return;
    }
    if (quantity <= 0) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const productRating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 120;

  // Handles Add/Remove from Wishlist
  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    // <motion.div
    //   initial={{ opacity: 0, y: 20 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ duration: 0.5 }}
    //   className="bg-white min-h-screen py-5 px-3 sm:px-6 lg:px-12 font-sans"
    // >
    //   <div className="max-w-6xl mx-auto">
    //     {/* Back Button */}
    //     <button
    //       onClick={() => navigate(-1)}
    //       className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-700 transition hover:-translate-x-1 duration-200"
    //     >
    //       <FaChevronLeft className="mr-2 text-blue-500" />
    //       Back to Shop
    //     </button>

    //     {/* Product Grid */}
    //     <motion.div
    //       initial={{ opacity: 0, scale: 0.97 }}
    //       animate={{ opacity: 1, scale: 1 }}
    //       transition={{ duration: 0.5 }}
    //       className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg overflow-hidden"
    //     >
    //       {/* Left: Image Section */}
    //       <div className="p-4 sm:p-5 bg-gray-50 flex flex-col items-center justify-center">
    //         <img
    //           src={mainImage}
    //           alt={product.name}
    //           // className="w-full max-h-[300px] sm:max-h-[400px] object-contain border border-gray-300 hover:border-blue-600 rounded-xl transition-transform duration-300 hover:scale-105"
    //           className="w-full max-h-[300px] sm:max-h-[400px] object-contain border-4 border-transparent rounded-xl bg-clip-padding bg-gradient-to-r from-blue-400 to-purple-500 hover:scale-105 transition-transform duration-300"
    //         />
    //         {product.images?.length > 0 && (
    //           <div className="flex overflow-x-auto gap-2 mt-4 px-1 sm:px-0">
    //             {product.images.map((img, index) => (
    //               <img
    //                 key={index}
    //                 src={img.url}
    //                 alt={`Thumb ${index + 1}`}
    //                 onClick={() => setMainImage(img.url)}
    //                 className={`w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border-2 cursor-pointer transition-all duration-200 shrink-0
    //             ${
    //               mainImage === img.url
    //                 ? "border-blue-600 ring-2 ring-blue-300"
    //                 : "border-gray-200 hover:border-blue-400 opacity-90"
    //             }`}
    //               />
    //             ))}
    //           </div>
    //         )}
    //       </div>

    //       {/* Right: Product Info */}
    //       <div className="p-4 sm:p-6 flex flex-col">
    //         {/* Title */}
    //         <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
    //           {product.name}
    //         </h1>

    //         {/* Rating */}
    //         <div className="flex items-center mb-3">
    //           <div className="flex text-yellow-400">
    //             {Array.from({ length: 5 }, (_, i) => (
    //               <FaStar
    //                 key={i}
    //                 className={
    //                   i < Math.floor(productRating) ? "" : "opacity-30"
    //                 }
    //               />
    //             ))}
    //           </div>
    //           <span className="text-sm text-gray-600 ml-2">
    //             ({reviewCount} Reviews)
    //           </span>
    //         </div>

    //         {/* Price */}
    //         <div className="flex flex-wrap items-center gap-3 mb-4">
    //           {currentOffer ? (
    //             <>
    //               <span className="text-xl sm:text-2xl font-bold text-green-600">
    //                 ₹{displayPrice?.toFixed(2)}
    //               </span>
    //               <span className="line-through text-gray-500 text-base sm:text-lg">
    //                 ₹{product.price.toFixed(2)}
    //               </span>
    //               <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
    //                 {currentOffer.offerPercentage}% OFF
    //               </span>
    //             </>
    //           ) : (
    //             <span className="text-xl sm:text-2xl font-bold text-gray-900">
    //               ₹{product.price.toFixed(2)}
    //             </span>
    //           )}
    //         </div>

    //         {/* Description */}
    //         <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
    //           {product.description}
    //         </p>

    //         <hr className="my-4 border-gray-200" />

    //         {/* Options */}
    //         <h3 className="text-base font-semibold text-gray-800 mb-2">
    //           Available Options:
    //         </h3>

    //         {/* Color */}
    //         {product.colors?.length > 0 && (
    //           <div className="mb-4">
    //             <label className="block text-sm font-medium mb-2">Color:</label>
    //             <div className="flex gap-3 flex-wrap">
    //               {product.colors.map((color) => (
    //                 <button
    //                   key={color}
    //                   onClick={() => setSelectedColor(color)}
    //                   style={{ backgroundColor: color }}
    //                   title={color}
    //                   className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition
    //               ${
    //                 selectedColor === color
    //                   ? "border-blue-600 ring-2 ring-blue-300"
    //                   : "border-gray-300 hover:border-blue-400"
    //               }`}
    //                 >
    //                   {selectedColor === color && (
    //                     <span className="text-white text-xs">✓</span>
    //                   )}
    //                 </button>
    //               ))}
    //             </div>
    //           </div>
    //         )}

    //         {/* Size */}
    //         {product.sizes?.length > 0 && (
    //           <div className="mb-5">
    //             <label className="block text-sm font-medium mb-2">Size:</label>
    //             <div className="flex gap-3 flex-wrap">
    //               {product.sizes.map((size) => (
    //                 <button
    //                   key={size}
    //                   onClick={() => setSelectedSize(size)}
    //                   className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md border-2 text-sm font-medium transition
    //               ${
    //                 selectedSize === size
    //                   ? "bg-blue-600 text-white border-blue-600"
    //                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
    //               }`}
    //                 >
    //                   {size.toUpperCase()}
    //                 </button>
    //               ))}
    //             </div>
    //           </div>
    //         )}

    //         {/* Quantity + Buttons */}
    //         <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4 border-t border-gray-100">
    //           {/* Quantity */}
    //           <div>
    //             <label className="block text-sm font-medium mb-2">
    //               Quantity:
    //             </label>
    //             <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-28">
    //               <button
    //                 onClick={() => setQuantity((q) => Math.max(1, q - 1))}
    //                 className="px-3 bg-gray-100 hover:bg-gray-200 text-lg"
    //               >
    //                 -
    //               </button>
    //               <input
    //                 type="number"
    //                 value={quantity}
    //                 min="1"
    //                 onChange={(e) =>
    //                   setQuantity(Math.max(1, parseInt(e.target.value) || 1))
    //                 }
    //                 className="w-full text-center border-x border-gray-300 outline-none text-sm"
    //               />
    //               <button
    //                 onClick={() => setQuantity((q) => q + 1)}
    //                 className="px-3 bg-gray-100 hover:bg-gray-200 text-lg"
    //               >
    //                 +
    //               </button>
    //             </div>
    //           </div>

    //           {/* Action Buttons */}
    //           <div className="flex flex-col sm:flex-row gap-3 flex-1">
    //             <button
    //               onClick={handleAddToCart}
    //               className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md font-semibold shadow transition"
    //             >
    //               <FaShoppingCart className="inline-block mr-2" />
    //               Add to Cart
    //             </button>
    //             <button
    //               onClick={handleWishlistClick}
    //               className={`w-full flex items-center justify-center border rounded-md py-2 transition
    //           ${
    //             isInWishlist(product._id)
    //               ? "border-red-500 bg-red-100 text-red-700 hover:bg-red-200"
    //               : "border-gray-300 text-gray-700 hover:bg-gray-100"
    //           }`}
    //             >
    //               <FaHeart
    //                 className={`mr-2 ${
    //                   isInWishlist(product._id) ? "text-red-500" : ""
    //                 }`}
    //               />
    //               {isInWishlist(product._id)
    //                 ? "Remove from Wishlist"
    //                 : "Add to Wishlist"}
    //             </button>
    //           </div>
    //         </div>

    //         {/* Category */}
    //         <p className="text-sm text-gray-600 mt-5 pt-4 border-t">
    //           <strong>Category:</strong> {categoryName}
    //         </p>
    //       </div>
    //     </motion.div>
    //   </div>
    // </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white min-h-screen py-4 px-3 sm:px-6 lg:px-12 font-sans"
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-700 transition hover:-translate-x-1 duration-200"
        >
          <FaChevronLeft className="mr-2 text-blue-500" />
          Back to Shop
        </button>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Left: Image Section */}
          {/* <div className="p-3 sm:p-5 bg-gray-50 flex flex-col items-center justify-center">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full max-h-[240px] sm:max-h-[400px] object-contain border-4 border-transparent rounded-xl bg-clip-padding bg-gradient-to-r from-blue-400 to-purple-500 hover:scale-105 transition-transform duration-300"
            />
            {product.images?.length > 0 && (
              <div className="flex overflow-x-auto gap-2 mt-3 sm:mt-4 px-1 sm:px-0">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`Thumb ${index + 1}`}
                    onClick={() => setMainImage(img.url)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md border-2 cursor-pointer transition-all duration-200 shrink-0
                  ${
                    mainImage === img.url
                      ? "border-blue-600 ring-2 ring-blue-300"
                      : "border-gray-200 hover:border-blue-400 opacity-90"
                  }`}
                  />
                ))}
              </div>
            )}
          </div> */}
          <div className="p-3 sm:p-5 bg-gray-50 flex flex-col items-center justify-center">
            {/* Main Image */}
            <div className="w-full max-w-[500px] sm:max-w-full">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto max-h-[220px] sm:max-h-[360px] object-contain rounded-xl border border-gray-300 shadow-md transition-transform duration-300 hover:scale-105 bg-white"
              />
            </div>

            {/* Thumbnails */}
            {product.images?.length > 0 && (
              <div className="flex overflow-x-auto gap-2 mt-3 sm:mt-4 px-1 sm:px-0">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`Thumb ${index + 1}`}
                    onClick={() => setMainImage(img.url)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md border-2 cursor-pointer transition-all duration-200 shrink-0
            ${
              mainImage === img.url
                ? "border-blue-600 ring-2 ring-blue-300"
                : "border-gray-200 hover:border-blue-400 opacity-90"
            }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="p-3 sm:p-6 flex flex-col">
            {/* Title */}
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="flex text-yellow-400 text-sm">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(productRating) ? "" : "opacity-30"
                    }
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 ml-2">
                ({reviewCount} Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              {currentOffer ? (
                <>
                  <span className="text-lg sm:text-2xl font-bold text-green-600">
                    ₹{displayPrice?.toFixed(2)}
                  </span>
                  <span className="line-through text-gray-500 text-sm sm:text-lg">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {currentOffer.offerPercentage}% OFF
                  </span>
                </>
              ) : (
                <span className="text-lg sm:text-2xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
              {product.description}
            </p>

            <hr className="my-3 sm:my-4 border-gray-200" />

            {/* Options */}
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Available Options:
            </h3>

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Color:</label>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      title={color}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 transition
                    ${
                      selectedColor === color
                        ? "border-blue-600 ring-2 ring-blue-300"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                    >
                      {selectedColor === color && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Size:</label>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 text-xs sm:text-sm rounded-md border-2 font-medium transition
                    ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-3 sm:pt-4 border-t border-gray-100">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-24 sm:w-28">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2 sm:px-3 bg-gray-100 hover:bg-gray-200 text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full text-center border-x border-gray-300 outline-none text-sm"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2 sm:px-3 bg-gray-100 hover:bg-gray-200 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md font-semibold shadow transition"
                >
                  <FaShoppingCart className="inline-block mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlistClick}
                  className={`w-full flex items-center justify-center border rounded-md py-2 transition
                ${
                  isInWishlist(product._id)
                    ? "border-red-500 bg-red-100 text-red-700 hover:bg-red-200"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                >
                  <FaHeart
                    className={`mr-2 ${
                      isInWishlist(product._id) ? "text-red-500" : ""
                    }`}
                  />
                  {isInWishlist(product._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>
            </div>

            {/* Category */}
            <p className="text-sm text-gray-600 mt-4 pt-3 border-t">
              <strong>Category:</strong> {categoryName}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SingleProductPage;
