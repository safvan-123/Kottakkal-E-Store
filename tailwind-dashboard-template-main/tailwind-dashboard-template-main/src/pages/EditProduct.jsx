import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const COLORS = ["red", "green", "white", "black", "blue"];
const SIZES = ["s", "m", "l", "xl", "xxl"];

const EditProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    shipping: false,
    cid: "",
    colors: [],
    sizes: [],
    imageUrl: "",
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5050/api/v1/product/get-product-by-id/${pid}`
        );

        if (data?.success) {
          setProduct({
            name: data.product.name,
            description: data.product.description,
            price: data.product.price,
            quantity: data.product.quantity,
            shipping: data.product.shipping,
            cid: data.product.category,
            colors: data.product.colors || [],
            sizes: data.product.sizes || [],
            imageUrl: data.product.imageUrl || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        alert("Failed to fetch product");
      }
    };
    fetchProduct();
  }, [pid]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "shipping") {
      setProduct((prev) => ({ ...prev, shipping: value === "1" }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle multi-select for colors and sizes
  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setProduct((prev) => {
      let updatedArray = [...prev[type]];
      if (checked) {
        if (!updatedArray.includes(value)) updatedArray.push(value);
      } else {
        updatedArray = updatedArray.filter((item) => item !== value);
      }
      return { ...prev, [type]: updatedArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("shipping", product.shipping ? "1" : "0");
      formData.append("category", product.cid);

      // Append colors and sizes as JSON strings
      formData.append("colors", JSON.stringify(product.colors));
      formData.append("sizes", JSON.stringify(product.sizes));

      if (photo) {
        formData.append("photo", photo);
      }

      const { data } = await axios.put(
        `http://localhost:5050/api/v1/product/update-product/${pid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        alert("✅ Product updated successfully");
        navigate(`/products/category/${product.cid}`);
      } else {
        alert(" Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert(" An error occurred during update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 max-w-lg w-full rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
            />
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
            />
          </div>

          <select
            name="shipping"
            value={product.shipping ? "1" : "0"}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="0">No Shipping</option>
            <option value="1">Shipping Available</option>
          </select>

          {/* Colors multi-checkbox */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Select Colors:
            </label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="colors"
                    value={color}
                    checked={product.colors.includes(color)}
                    onChange={(e) => handleCheckboxChange(e, "colors")}
                    className="form-checkbox"
                  />
                  <span className="capitalize">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes multi-checkbox */}
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Select Sizes:
            </label>
            <div className="flex flex-wrap gap-3">
              {SIZES.map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    checked={product.sizes.includes(size)}
                    onChange={(e) => handleCheckboxChange(e, "sizes")}
                    className="form-checkbox"
                  />
                  <span className="uppercase">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full text-gray-700 dark:text-gray-300"
          />

          {/* Show new photo preview or existing image */}
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="mt-2 h-32 w-full object-cover rounded-md"
            />
          ) : product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt="Current"
              className="mt-2 h-32 w-full object-cover rounded-md"
            />
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
