import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const Products = () => {
  const { cid } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/product/products-by-category/${cid}`
        );
        if (data?.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/category/single-category/${cid}`
        );
        if (data?.success) {
          setCategory(data.category);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };

    fetchProducts();
    fetchCategory();
  }, [cid]);

  const handleDelete = async (pid) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/product/delete-product/${pid}`
      );
      if (data.success) {
        alert("✅ Product deleted successfully");

        setProducts((prev) => prev.filter((p) => p._id !== pid));
      } else {
        alert("❌ Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ An error occurred while deleting");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white uppercase">
        {category ? `${category.name} ` : "Loading Category..."}
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No products found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>

                {/* New columns for Sizes and Colors */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sizes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Colors
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={
                        product.imageUrl ||
                        `/api/v1/product/product-photo/${product._id}`
                      }
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-semibold">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 line-clamp-2 max-w-xs">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 dark:text-green-400 font-bold">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 dark:text-blue-400 font-medium">
                    {product.quantity}
                  </td>

                  {/* Display sizes as comma separated */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {product.sizes && product.sizes.length > 0
                      ? product.sizes.join(", ").toUpperCase()
                      : "N/A"}
                  </td>

                  {/* Display colors as colored dots with text */}
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2 items-center">
                    {product.colors && product.colors.length > 0
                      ? product.colors.map((color) => (
                          <div
                            key={color}
                            className="flex items-center space-x-1"
                          >
                            <span
                              className="inline-block w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            ></span>
                            <span className="text-gray-900 dark:text-white text-xs">
                              {color}
                            </span>
                          </div>
                        ))
                      : "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          navigate(`/update-product/${product._id}`)
                        }
                        className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                        aria-label="Edit Product"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-600 focus:outline-none"
                        aria-label="Delete Product"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
