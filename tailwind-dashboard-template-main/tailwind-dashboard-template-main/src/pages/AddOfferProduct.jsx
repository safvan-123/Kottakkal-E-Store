import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddOfferProduct = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5050/api/v1/category/get-category"
        );
        console.log(data);

        if (data.success) {
          setCategories(data.category);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);
  console.log(selectedCategory);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;
      try {
        const { data } = await axios.get(
          `http://localhost:5050/api/v1/product/products-by-category/${selectedCategory}`
        );
        //localhost:5050/api/v1/product/products-by-category/685587b3080266fea08b7661
        console.log(data);

        if (data?.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "http://localhost:5050/api/offer-products/addoffer-products",
        {
          productId: selectedProduct,
          offerPercentage,
        }
      );
      alert("Offer product added successfully");

      navigate("/get-offer-products");
    } catch (err) {
      console.error("Failed to add offer product:", err);
      setError("Something went wrong while adding the offer product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Add Offer Product
        </h2>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        {/* Category Dropdown */}
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Select Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedProduct("");
            setProducts([]);
          }}
          className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        >
          <option value="">Select a Category</option>
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>

        {/* Product Dropdown */}
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Select Product
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
          disabled={!selectedCategory}
        >
          <option value="">Select a Product</option>
          {products?.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Offer Percentage */}
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Offer Percentage
        </label>
        <input
          type="number"
          min="1"
          max="100"
          placeholder="Offer %"
          value={offerPercentage}
          onChange={(e) => setOfferPercentage(e.target.value)}
          className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add to Offers"}
        </button>
      </form>
    </div>
  );
};

export default AddOfferProduct;
