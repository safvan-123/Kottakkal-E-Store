import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/homepage/needs/ProductCard";
import { useCategory } from "../context/CategoryContext";
import {
  FaThLarge,
  FaList,
  FaFilter,
  FaTimes,
  FaGift,
  FaTags,
  FaBolt,
  FaFire,
} from "react-icons/fa";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const ShopPage = () => {
  const { subCategories } = useCategory();

  const [allProducts, setAllProducts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [errorInitial, setErrorInitial] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortOption, setSortOption] = useState("latest");
  const [gridView, setGridView] = useState(true);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 9;

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [errorFilters, setErrorFilters] = useState(null);

  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingInitial(true);
      setErrorInitial(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/product`
        );
        setAllProducts(response.data.products);
      } catch (err) {
        setErrorInitial("Failed to fetch products");
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const sizes = new Set();
      const colors = new Set();
      allProducts.forEach((p) => {
        if (p.sizes && Array.isArray(p.sizes)) {
          p.sizes.forEach((size) => sizes.add(size.toUpperCase()));
        }
        if (p.colors && Array.isArray(p.colors)) {
          p.colors.forEach((color) => colors.add(color));
        }
      });
      setAvailableSizes(Array.from(sizes).sort());
      setAvailableColors(Array.from(colors).sort());
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [allProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 6000); // 4 seconds

    return () => clearTimeout(timer); // Cleanup
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("subCategory");
    if (categoryFromUrl && subCategories.length > 0) {
      const matchedCategory = subCategories.find(
        (cat) => cat.name === categoryFromUrl
      );
      if (matchedCategory) {
        setSelectedCategories((prev) => {
          if (!prev.includes(matchedCategory.name)) {
            return [matchedCategory.name];
          }
          return prev;
        });
      }
    }
  }, [location.search, subCategories]);

  // Helper to get category count for filters
  const filterCategories = subCategories.map((cat) => ({
    ...cat,
    count: allProducts.filter((p) => {
      const categoryId =
        typeof p.subCategory === "object" ? p.subCategory?._id : p.subCategory;
      const matchingApiCategory = subCategories.find(
        (apiCat) => apiCat._id === categoryId
      );
      return matchingApiCategory && matchingApiCategory.name === cat.name;
    }).length,
  }));

  // Function to apply all filters and sorting - memoized with useCallback
  const applyFilters = useCallback(() => {
    setLoadingFilters(true);
    setErrorFilters(null);
    let filtered = [...allProducts];

    if (selectedCategories.length > 0) {
      const selectedCategoryIds = subCategories
        .filter((cat) => selectedCategories.includes(cat.name))
        .map((cat) => cat._id);

      filtered = filtered.filter((p) => {
        const categoryId =
          typeof p.subCategory === "object"
            ? p.subCategory?._id
            : p.subCategory;
        return selectedCategoryIds.includes(categoryId);
      });
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.sizes &&
          p.sizes.some((size) => selectedSizes.includes(size.toUpperCase()))
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.colors && p.colors.some((color) => selectedColors.includes(color))
      );
    }

    filtered = filtered.filter((p) => {
      const price = Number(p.price);
      return (
        !isNaN(price) && price >= priceRange.min && price <= priceRange.max
      );
    });

    if (sortOption === "price-low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setDisplayedProducts(filtered);
    setLoadingFilters(false);
    setCurrentPage(1);
  }, [
    allProducts,
    selectedCategories,
    selectedSizes,
    selectedColors,
    priceRange,
    sortOption,
    subCategories,
  ]);

  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [
    allProducts,
    selectedCategories,
    selectedSizes,
    selectedColors,
    priceRange,
    sortOption,
    applyFilters,
  ]);
  console.log(displayedProducts);

  // Pagination helpers
  const totalPages = Math.ceil(displayedProducts.length / PRODUCTS_PER_PAGE);

  // Get products for current page
  const paginatedProducts = displayedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Change page handler
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryCheckboxChange = (catName) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName];

      const params = new URLSearchParams(location.search);
      if (newCategories.length === 1) {
        params.set("category", newCategories[0]);
      } else if (newCategories.length === 0) {
        params.delete("category");
      } else {
        params.delete("category");
      }
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });

      return newCategories;
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: 0, max: 100000 });
    setSortOption("latest");
    setCurrentPage(1);
    navigate("/shop", { replace: true });
    setShowMobileFilters(false);
  };

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
      const testDiv = document.createElement("div");
      testDiv.style.color = color;
      document.body.appendChild(testDiv);
      const computedColor = window.getComputedStyle(testDiv).color;
      document.body.removeChild(testDiv);

      const rgbMatch = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (rgbMatch) {
        hexColor =
          "#" +
          ("0" + parseInt(rgbMatch[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgbMatch[2], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgbMatch[3], 10).toString(16)).slice(-2);
      } else {
        return false;
      }
    }

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
  };

  const FilterSidebar = () => (
    <div
      className={`
            ${
              showMobileFilters
                ? "fixed inset-y-0 left-0 w-64 bg-white z-50 transform translate-x-0 overflow-y-auto pt-6"
                : "hidden"
            }
            lg:block lg:relative lg:w-1/4 lg:translate-x-0 lg:p-6 lg:rounded-lg lg:shadow-md
        `}
    >
      {/* Close button for mobile filters */}
      <div className="lg:hidden flex justify-end p-4">
        <button
          onClick={() => setShowMobileFilters(false)}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Close filters"
        >
          <FaTimes size={24} />
        </button>
      </div>

      <div className="p-6 lg:p-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Filters:</h3>
          <button
            onClick={handleClearAllFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer flex justify-between items-center">
            Category <span className="text-gray-400">^</span>
          </h4>
          {filterCategories.map((cat) => (
            <label
              key={cat._id}
              className="flex items-center mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => handleCategoryCheckboxChange(cat.name)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-gray-700">
                {cat.name} ({cat.count})
              </span>
            </label>
          ))}
        </div>

        {/* Dynamically rendered Size filter */}
        {availableSizes.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer flex justify-between items-center">
              Size <span className="text-gray-400">^</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    selectedSizes.includes(size)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamically rendered Color filter */}
        {availableColors.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer flex justify-between items-center">
              Colors <span className="text-gray-400">^</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    selectedColors.includes(color)
                      ? "border-blue-600 ring-2 ring-blue-300"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Color ${color}`}
                >
                  {selectedColors.includes(color) && (
                    <span
                      className={`text-sm ${
                        isLightColor(color) ? "text-gray-800" : "text-white"
                      }`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 cursor-pointer flex justify-between items-center">
            Price <span className="text-gray-400">^</span>
          </h4>
          <div className="flex justify-between items-center mb-4">
            <input
              type="number"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              placeholder="Min price"
              className="w-1/2 p-2 border border-gray-300 rounded-md text-center mr-2"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              placeholder="Max price"
              className="w-1/2 p-2 border border-gray-300 rounded-md text-center ml-2"
            />
          </div>
          <div className="text-sm text-gray-600 text-center">
            ₹{priceRange.min || 0} - ₹{priceRange.max || 0}
          </div>
        </div>
      </div>
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50"
        >
          Prev
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className={`px-3 py-1 rounded border border-gray-300 bg-white`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 py-1">...</span>}
          </>
        )}

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => goToPage(num)}
            className={`px-3 py-1 rounded border ${
              num === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300"
            }`}
          >
            {num}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 py-1">...</span>}
            <button
              onClick={() => goToPage(totalPages)}
              className={`px-3 py-1 rounded border border-gray-300 bg-white`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border border-gray-300 bg-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-white via-gray-50 to-white py-6 sm:py-8 border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Heading with animated underline */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 relative inline-block"
          >
            Explore All Products
            <span className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-md scale-x-0 origin-left animate-underline" />
          </motion.h1>

          {/* Breadcrumbs */}
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm sm:text-base text-gray-600 flex flex-wrap items-center gap-2"
          >
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              to="/shop"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-blue-600 font-semibold">
              Shop With Sidebar
            </span>
          </motion.nav>
        </div>
      </motion.section>
      <AnimatePresence mode="wait">
        {showBanner && (
          <motion.section
            key="promo"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative text-center py-6 sm:py-12 px-4 sm:px-8 bg-gradient-to-br from-purple-800 via-fuchsia-700 to-pink-600 text-white rounded-2xl shadow-2xl mb-10 overflow-hidden border-b border-blue-200"
          >
            {/* Floating Glows */}
            <div className="pointer-events-none absolute -top-10 -left-10 w-40 h-40 bg-pink-400 opacity-20 rounded-full filter blur-2xl animate-pulse"></div>
            <div className="pointer-events-none absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-300 opacity-20 rounded-full filter blur-2xl animate-ping"></div>

            {/* Floating Icons */}
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

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-white mt-6">
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md mb-2"
              >
                <span className="bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-transparent bg-clip-text">
                  മലപ്പുറത്തിന്റെ വിശ്വസ്ത ഷോപ്പിംഗ് സേവനം!
                </span>{" "}
                🛍️
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-sm sm:text-base md:text-xl font-medium text-blue-100"
              >
                നിങ്ങൾക്കാവശ്യമായ സാധനങ്ങൾ എല്ലാം ഇനി നിങ്ങളെ തേടിയെത്തും! 🛍️ 🚚{" "}
                <br />
                ഇനി വാങ്ങാം വീട്ടിലിരുന്ന്! 🪑📦
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="mt-6 flex flex-col items-center gap-2"
              >
                <a
                  href="#shop-now"
                  className="inline-block bg-white text-pink-600 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-md hover:bg-pink-100 transition-all duration-300 text-sm sm:text-base"
                >
                  ഇപ്പോൾ ഓർഡർ ചെയ്യൂ
                </a>
                <span className="text-lg sm:text-xl animate-bounce">👇</span>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <section className="py-6 md:py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 relative">
          <FilterSidebar />

          {showMobileFilters && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            ></div>
          )}

          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden p-2 rounded-md bg-blue-600 text-white flex items-center gap-2"
                aria-label="Open filters"
              >
                <FaFilter />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-4">
                <span className="text-gray-600 hidden sm:block">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md bg-white text-gray-700"
                >
                  <option value="latest">Latest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm hidden md:block">
                  Showing {paginatedProducts.length} of{" "}
                  {displayedProducts.length} products
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGridView(true)}
                    className={`p-2 rounded-md ${
                      gridView
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    aria-label="Grid View"
                  >
                    <FaThLarge />
                  </button>
                  <button
                    onClick={() => setGridView(false)}
                    className={`p-2 rounded-md ${
                      !gridView
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    aria-label="List View"
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {loadingInitial || loadingFilters ? (
              <div className="text-center text-gray-600 py-10">
                Loading products...
              </div>
            ) : errorInitial || errorFilters ? (
              <div className="text-center text-red-500 py-10">
                {errorInitial || errorFilters}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center text-gray-600 py-10">
                No products found matching your filters.
              </div>
            ) : (
              <>
                <div
                  className={`${
                    gridView
                      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }`}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isListView={!gridView}
                    />
                  ))}
                </div>

                <Pagination />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;
