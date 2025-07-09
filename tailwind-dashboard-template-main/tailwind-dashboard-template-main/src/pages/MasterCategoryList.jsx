// 📁 src/pages/MasterCategoryListPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function MasterCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/master-categories`
      );
      setCategories(data.categories);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/master-categories/${id}`
      );
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Master Categories
        </h2>
        <Link
          to="/addmaster"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md"
        >
          + Add Master Category
        </Link>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="text-left bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Image</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat, index) => (
                <tr
                  key={cat._id}
                  className="border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <Link
                      to={`/listmaster/${cat._id}`}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
