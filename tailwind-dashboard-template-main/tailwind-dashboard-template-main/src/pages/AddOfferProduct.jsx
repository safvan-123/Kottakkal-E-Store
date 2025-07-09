// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AddOfferProduct = () => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [products, setProducts] = useState([]);

//   const [selectedProduct, setSelectedProduct] = useState("");
//   const [offerPercentage, setOfferPercentage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
//         );
//         console.log(data);

//         if (data.success) {
//           setCategories(data.category);
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         setError("Failed to load categories");
//       }
//     };

//     fetchCategories();
//   }, []);
//   console.log(selectedCategory);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!selectedCategory) return;
//       try {
//         const { data } = await axios.get(
//           `${
//             import.meta.env.VITE_API_URL
//           }/api/v1/product/products-by-category/${selectedCategory}`
//         );
//         //localhost:5050/api/v1/product/products-by-category/685587b3080266fea08b7661
//         console.log(data);

//         if (data?.success) {
//           setProducts(data.products);
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setError("Failed to load products");
//       }
//     };

//     fetchProducts();
//   }, [selectedCategory]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/offer-products/addoffer-products`,
//         {
//           productId: selectedProduct,
//           offerPercentage,
//         }
//       );
//       alert("Offer product added successfully");

//       navigate("/get-offer-products");
//     } catch (err) {
//       console.error("Failed to add offer product:", err);
//       setError("Something went wrong while adding the offer product");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex justify-center items-start">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
//           Add Offer Product
//         </h2>

//         {error && <p className="mb-4 text-red-600">{error}</p>}

//         {/* Category Dropdown */}
//         <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//           Select Category
//         </label>
//         <select
//           value={selectedCategory}
//           onChange={(e) => {
//             setSelectedCategory(e.target.value);
//             setSelectedProduct("");
//             setProducts([]);
//           }}
//           className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
//           required
//         >
//           <option value="">Select a Category</option>
//           {Array.isArray(categories) &&
//             categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//         </select>

//         {/* Product Dropdown */}
//         <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//           Select Product
//         </label>
//         <select
//           value={selectedProduct}
//           onChange={(e) => setSelectedProduct(e.target.value)}
//           className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
//           required
//           disabled={!selectedCategory}
//         >
//           <option value="">Select a Product</option>
//           {products?.map((p) => (
//             <option key={p._id} value={p._id}>
//               {p.name}
//             </option>
//           ))}
//         </select>

//         {/* Offer Percentage */}
//         <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
//           Offer Percentage
//         </label>
//         <input
//           type="number"
//           min="1"
//           max="100"
//           placeholder="Offer %"
//           value={offerPercentage}
//           onChange={(e) => setOfferPercentage(e.target.value)}
//           className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded-md text-white ${
//             loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Adding..." : "Add to Offers"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddOfferProduct;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddOfferProduct = () => {
  const [masterCategories, setMasterCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedMasterCategory, setSelectedMasterCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch master categories and all subcategories
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [masterRes, subRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/master-categories`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/sub-categories`),
        ]);
        setMasterCategories(masterRes.data.categories || []);
        setSubCategories(subRes.data.subCategories || []);
      } catch (err) {
        setError("Failed to load categories");
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch products based on subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedSubCategory) return;
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/product/products-by-category/${selectedSubCategory}`
        );
        if (res.data.success) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      }
    };
    fetchProducts();
  }, [selectedSubCategory]);
  console.log(products);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/offer-products/addoffer-products`,
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

        {/* Master Category */}
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Master Category
        </label>
        <select
          value={selectedMasterCategory}
          onChange={(e) => {
            setSelectedMasterCategory(e.target.value);
            setSelectedSubCategory("");
            setSelectedProduct("");
            setProducts([]);
          }}
          className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select Master Category</option>
          {masterCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sub Category */}
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Sub Category
        </label>
        <select
          value={selectedSubCategory}
          onChange={(e) => {
            setSelectedSubCategory(e.target.value);
            setSelectedProduct("");
          }}
          className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          required
          disabled={!selectedMasterCategory}
        >
          <option value="">Select Sub Category</option>
          {subCategories
            .filter((sc) => sc.masterCategory?._id === selectedMasterCategory)
            .map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
        </select>

        {/* Product Dropdown */}
        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          Product
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
          required
          disabled={!selectedSubCategory}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
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
          className="block w-full mb-6 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
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
