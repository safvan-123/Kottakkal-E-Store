import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const COLORS = ["red", "green", "white", "black", "blue"];
const SIZES = ["s", "m", "l", "xl", "xxl"];

const CreateProduct = () => {
  const { cid } = useParams();
  console.log(cid);

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    shipping: false,
    colors: [],
    sizes: [],
  });
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!cid) {
        alert("❌ No category selected. Cannot create product.");
        return;
      }
      try {
        const { data } = await axios.get(
          `http://localhost:5050/api/v1/category/single-category/${cid}`
        );
        if (data.success) {
          setCategory(data.category);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };
    fetchCategory();
  }, [cid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "shipping" ? value === "1" : value,
    }));
  };

  const handleCheckboxChange = (type, value) => {
    setProduct((prev) => {
      const updatedList = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updatedList };
    });
  };

  const uploadToCloudinary = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "estore_preset");
    data.append("cloud_name", "dflo0i4sq");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dflo0i4sq/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let uploadedImageURL = null;

      if (photo) {
        uploadedImageURL = await uploadToCloudinary(photo);
      }

      const payload = {
        ...product,
        category: cid,
        imageUrl: uploadedImageURL || "",
      };

      console.log("Submitting payload:", payload);

      const { data } = await axios.post(
        "http://localhost:5050/api/v1/product/create-product",
        payload
      );

      if (data.success) {
        alert("✅ Product Created");
        setProduct({
          name: "",
          description: "",
          price: "",
          quantity: "",
          shipping: false,
          colors: [],
          sizes: [],
        });
        setPhoto(null);
        navigate(`/products/category/${cid}`);
      } else {
        alert(" Failed to create product");
      }
    } catch (err) {
      console.error(err);
      alert(" Failed to create product: " + err?.response?.data?.message);
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl shadow-md p-8 overflow-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-4">
          Create Product in:{" "}
          <span className="text-green-500">{category?.name || "..."}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Color selection */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Colors
            </label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <label
                  key={color}
                  className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={product.colors.includes(color)}
                    onChange={() => handleCheckboxChange("colors", color)}
                  />
                  <span>{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-3">
              {SIZES.map((size) => (
                <label
                  key={size}
                  className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={product.sizes.includes(size)}
                    onChange={() => handleCheckboxChange("sizes", size)}
                  />
                  <span>{size.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full text-sm text-gray-700 dark:text-gray-200"
          />

          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="h-32 w-full object-cover rounded-md mt-2"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
