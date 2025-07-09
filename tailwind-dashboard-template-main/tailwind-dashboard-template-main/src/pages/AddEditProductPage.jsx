import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddEditProductPage() {
  const [searchParams] = useSearchParams();
  const pageFromQuery = searchParams.get("page");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    masterCategory: "",
    subCategory: "",
    imageUrl: "",
    sizes: [],
    colors: [],
    tags: [],
    weight: "",
    status: "Active",
  });

  const [masterCategories, setMasterCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/master-categories`)
      .then((res) => setMasterCategories(res.data.categories || []));
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/sub-categories`)
      .then((res) => setSubCategories(res.data.subCategories || []));

    if (id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/v1/product/${id}`)
        .then((res) => setForm(res.data));
    }
  }, [id]);
  console.log(form);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Image Upload Handler (Cloudinary)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // single file only
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME
        }/image/upload`,
        formData
      );

      const uploadedImageUrl = res.data.secure_url;

      setForm((prev) => ({
        ...prev,
        imageUrl: uploadedImageUrl,
      }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/product/${id}`,
          form
        );
        toast.success("Product updated");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/product`,
          form
        );
        toast.success("Product created");
      }
      navigate(`/products?page=${pageFromQuery}`);
    } catch (err) {
      toast.error("Error: " + err.response?.data?.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        {id ? "Edit Product" : "Add Product"}
      </h2>

      <form
        onSubmit={form?.imageUrl && handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Price, Discount Price, Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Discount Price
            </label>
            <input
              name="discountPrice"
              type="number"
              value={form.discountPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="Enter SKU"
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Master Category */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Master Category
          </label>
          <select
            name="masterCategory"
            value={form?.masterCategory?._id || form?.masterCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Master Category</option>
            {masterCategories.map((mc) => (
              <option key={mc._id} value={mc._id}>
                {mc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Sub Category</label>
          <select
            name="subCategory"
            value={form?.subCategory?._id || form?.subCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Sub Category</option>
            {subCategories
              .filter(
                (sc) =>
                  sc.masterCategory._id ===
                  (form.masterCategory?._id || form.masterCategory)
              )
              .map((sc) => (
                <option key={sc._id} value={sc._id}>
                  {sc.name}
                </option>
              ))}
          </select>
        </div>

        {/* ✅ Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Images
          </label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-24 h-24 object-cover border rounded mt-2"
              />
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            onClick={() => console.log("clicked")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            disabled={!form?.imageUrl && true}
          >
            {id ? "Update" : "Create"} Product
          </button>
        </div>
      </form>
    </div>
  );
}
