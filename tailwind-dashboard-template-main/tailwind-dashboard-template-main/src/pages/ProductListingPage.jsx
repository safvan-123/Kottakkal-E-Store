// 📁 frontend/src/pages/ProductListPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const pageFromQuery = searchParams.get("page");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // can make dynamic
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const navigate = useNavigate();

  const fetchProducts = async (currentPage = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/product?page=${currentPage}&limit=${limit}`
      );

      setProducts(data.products || []);
      setPagination(data.pagination);
      setPage(currentPage);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentPage = parseInt(pageFromQuery) || 1;
    fetchProducts(currentPage);
  }, [pageFromQuery]);
  console.log(products);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/product/${id}`
      );
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };
  console.log(products);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Products
        </h2>
        <Link
          to="/addproduct"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr className="text-left bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
              <th className="p-3">No</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, idx) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white"
                >
                  <td className="px-4 py-2">{(page - 1) * limit + idx + 1}</td>
                  <td className="p-3">
                    {product?.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">
                    {product.masterCategory?.name +
                      " ," +
                      product.subCategory?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <Link
                      to={`/addproduct/${product._id}?page=${page}`}
                      className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
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
        <div className="flex justify-center items-center mt-6 space-x-2 text-sm">
          <button
            onClick={() => fetchProducts(1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            First
          </button>

          <button
            onClick={() => fetchProducts(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-1 text-gray-800 dark:text-white font-medium">
            Page <span className="font-bold">{page}</span> of{" "}
            <span className="font-bold">{pagination.totalPages}</span>
          </span>

          <button
            onClick={() => fetchProducts(page + 1)}
            disabled={page === pagination.totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>

          <button
            onClick={() => fetchProducts(pagination.totalPages)}
            disabled={page === pagination.totalPages}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
