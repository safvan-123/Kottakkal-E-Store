// frontend/src/pages/SubCategoriesPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function SubCategoriesPage() {
  const { masterCategoryname } = useParams();

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sub-categories`
        );

        const filtered = data.subCategories.filter(
          (sc) => sc.masterCategory?.name === masterCategoryname
        );

        setSubCategories(filtered);
      } catch (err) {
        toast.error("Failed to load subcategories", err);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchSubCategories();
  }, [masterCategoryname]);

  const handleClick = (subCategoryname) => {
    // navigate(`/shop?subCategory=${subCategoryname}`);
    navigate(`/shop?subCategory=${encodeURIComponent(subCategoryname)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Explore Subcategories
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : subCategories.length === 0 ? (
        <p className="text-center text-gray-500">
          No subcategories found for this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subCategories.map((sub) => (
            <motion.div
              key={sub._id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleClick(sub.name)}
              className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
            >
              <div className="h-40 w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                <img
                  src={sub.image || "/images/default-category.png"}
                  alt={sub.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-center text-xl font-semibold text-gray-800">
                {sub.name}
              </h3>
              <p className="text-sm text-center text-gray-500 mt-1">
                {sub.description || "No description"}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
