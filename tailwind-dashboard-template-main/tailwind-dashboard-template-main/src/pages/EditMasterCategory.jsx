import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export default function EditMasterCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState(""); // image URL
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/master-categories/${id}`
        );
        setName(data.name);
        setImage(data.image);
      } catch (err) {
        toast.error("Failed to load category");
      }
    };

    fetchCategory();
  }, [id]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Name is required");

    try {
      setLoading(true);

      let imageUrl = image;
      if (newImageFile) {
        imageUrl = await uploadToCloudinary(newImageFile);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/master-categories/${id}`,
        {
          name,
          image: imageUrl,
        }
      );

      toast.success("Category updated successfully");
      navigate("/listmaster"); // Change route as needed
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Edit Master Category
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Category Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Image Field */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Image
          </label>
          {image && (
            <img
              src={image}
              alt="Current"
              className="w-24 h-24 rounded mb-2 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            className="w-full text-gray-800 dark:text-white"
            onChange={(e) => setNewImageFile(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
}
