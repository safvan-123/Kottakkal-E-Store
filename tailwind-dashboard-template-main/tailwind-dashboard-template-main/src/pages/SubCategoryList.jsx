// src/pages/SubCategoryListPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SubCategoryListPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/sub-categories`
      );
      setSubCategories(data.subCategories);
    } catch (err) {
      toast.error("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/sub-categories/${id}`
      );
      toast.success("Deleted successfully");
      fetchSubCategories();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Sub Categories
        </h2>
        <Link
          to="/addsubcategory"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md"
        >
          + Add Sub Category
        </Link>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="text-left bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Master Category</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : subCategories.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No subcategories found.
                </td>
              </tr>
            ) : (
              subCategories.map((sub) => (
                <tr
                  key={sub._id}
                  className="border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white"
                >
                  <td className="p-3">
                    {sub.image ? (
                      <img
                        src={sub.image}
                        alt={sub.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{sub.name}</td>
                  <td className="p-3">{sub.masterCategory?.name}</td>
                  <td className="p-3 text-sm">{sub.description}</td>
                  <td className="p-3 space-x-2">
                    <Link
                      to={`/addsubcategory/${sub._id}`}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(sub._id)}
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
