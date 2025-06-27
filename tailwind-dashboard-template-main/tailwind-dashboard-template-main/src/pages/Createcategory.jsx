import React, { useState } from "react";
import axios from "axios";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Category name cannot be empty.");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const { data } = await axios.post(
        "https://kottakkal-e-store.onrender.com/api/v1/category/create-category",
        { name }
      );

      if (data?.success) {
        setMessage("✅ Category created successfully!");
        setIsError(false);
        setName("");

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else if (data.message?.toLowerCase().includes("already exists")) {
        setMessage(" Category already exists.");
        setIsError(true);
      } else {
        setMessage(" Failed to create category.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setMessage(" Server error. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Create New Category
        </h2>

        {message && (
          <div
            className={`text-sm mb-4 px-4 py-2 rounded ${
              isError
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
