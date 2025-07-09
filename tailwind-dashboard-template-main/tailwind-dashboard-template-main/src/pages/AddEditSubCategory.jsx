// src/pages/AddEditSubCategoryPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export default function AddEditSubCategoryPage() {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [masterCategory, setMasterCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [masterCategories, setMasterCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMasterCategories = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/master-categories`
      );
      setMasterCategories(data.categories || []);
    };

    const fetchSubCategory = async () => {
      if (id) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/sub-categories/${id}`
        );
        setName(data.name);
        setMasterCategory(data.masterCategory._id);
        setDescription(data.description);
        setPreview(data.image);
      }
    };

    fetchMasterCategories();
    fetchSubCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !masterCategory) return toast.error("All fields are required");

    try {
      setLoading(true);
      let imageUrl = preview;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = { name, masterCategory, image: imageUrl, description };

      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/sub-categories/${id}`,
          payload
        );
        toast.success("Subcategory updated");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/sub-categories/add`,
          payload
        );
        toast.success("Subcategory added");
      }

      navigate("/listsubcategory");
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
        {id ? "Edit Sub Category" : "Add Sub Category"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Sub Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Master Category
          </label>
          <select
            value={masterCategory}
            onChange={(e) => setMasterCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          >
            <option value="">Select master category</option>
            {masterCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 w-24 h-24 rounded object-cover border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md"
        >
          {loading
            ? "Saving..."
            : id
            ? "Update Sub Category"
            : "Add Sub Category"}
        </button>
      </form>
    </div>
  );
}
