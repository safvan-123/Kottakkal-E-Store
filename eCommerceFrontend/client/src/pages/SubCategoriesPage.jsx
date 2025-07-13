// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";

// export default function SubCategoriesPage() {
//   const { masterCategoryname } = useParams();
//   const [subCategories, setSubCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSubCategories = async () => {
//       try {
//         const { data } = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/sub-categories`
//         );

//         const filtered = data.subCategories.filter(
//           (sc) => sc.masterCategory?.name === masterCategoryname
//         );

//         setSubCategories(filtered);
//       } catch (err) {
//         toast.error("Failed to load subcategories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     fetchSubCategories();
//   }, [masterCategoryname]);

//   const handleClick = (subCategoryname) => {
//     navigate(`/shop?subCategory=${encodeURIComponent(subCategoryname)}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-4 md:px-10">
//       <motion.h2
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="text-3xl font-bold text-center text-gray-800 mb-10"
//       >
//         Explore <span className="text-blue-600">{masterCategoryname}</span>
//       </motion.h2>

//       {loading ? (
//         <p className="text-center text-gray-500 text-lg">Loading...</p>
//       ) : subCategories.length === 0 ? (
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center text-gray-500 text-lg"
//         >
//           No subcategories found for this category.
//         </motion.p>
//       ) : (
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={{
//             hidden: { opacity: 0, y: 20 },
//             visible: {
//               opacity: 1,
//               y: 0,
//               transition: {
//                 staggerChildren: 0.1,
//               },
//             },
//           }}
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//         >
//           {subCategories.map((sub) => (
//             <motion.div
//               key={sub._id}
//               whileHover={{ scale: 1.05 }}
//               className="bg-white rounded-2xl shadow-md hover:shadow-xl p-4 cursor-pointer transition-all duration-300"
//               onClick={() => handleClick(sub.name)}
//               variants={{
//                 hidden: { opacity: 0, y: 20 },
//                 visible: { opacity: 1, y: 0 },
//               }}
//             >
//               <div className="h-40 w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
//                 <img
//                   src={sub.image || "/images/default-category.png"}
//                   alt={sub.name}
//                   className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                 />
//               </div>
//               <h3 className="mt-4 text-center text-lg font-semibold text-gray-800">
//                 {sub.name}
//               </h3>
//               <p className="text-sm text-center text-gray-500 mt-1">
//                 {sub.description || "No description"}
//               </p>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </div>
//   );
// }

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
        toast.error("Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchSubCategories();
  }, [masterCategoryname]);

  const handleClick = (subCategoryname) => {
    navigate(`/shop?subCategory=${encodeURIComponent(subCategoryname)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10 px-4 sm:px-6 lg:px-12 font-sans">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8"
      >
        Explore <span className="text-blue-600">{masterCategoryname}</span>
      </motion.h2>

      {loading ? (
        <p className="text-center text-gray-500 text-base sm:text-lg">
          Loading...
        </p>
      ) : subCategories.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 text-base sm:text-lg"
        >
          No subcategories found for this category.
        </motion.p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          // 👇 Two columns on all devices
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {subCategories.map((sub) => (
            <motion.div
              key={sub._id}
              whileHover={{ scale: 1.03, rotate: 0.3 }}
              whileTap={{ scale: 0.96 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              onClick={() => handleClick(sub.name)}
              className="bg-white border border-gray-100 hover:border-blue-400 rounded-xl shadow-sm hover:shadow-lg p-4 transition-all duration-300 cursor-pointer"
            >
              <div className="h-40 sm:h-44 w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                <img
                  src={sub.image || "/images/default-category.png"}
                  alt={sub.name}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="mt-3 text-center text-sm sm:text-base font-semibold text-gray-800">
                {sub.name}
              </h3>
              <p className="text-xs sm:text-sm text-center text-gray-500 mt-1">
                {sub.description || "No description available"}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
