// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { uploadToCloudinary } from "../utils/cloudinaryUpload";
// import { ImagePlus, Upload } from "lucide-react"; // optional icons
// import { useNavigate } from "react-router-dom";

// export default function AddMasterCategoryPage() {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   console.log(import.meta.env.VITE_API_URL);
//   console.log(name);
//   console.log(preview);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImageFile(file);

//     setPreview(URL.createObjectURL(file));
//   };
//   console.log(imageFile);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !imageFile) return toast.error("All fields are required");

//     try {
//       setLoading(true);
//       const imageUrl = await uploadToCloudinary(imageFile);

//       const test = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/master-categories/add`,
//         { name, image: imageUrl }
//       );
//       console.log(test);

//       toast.success("Category added successfully");
//       setName("");
//       setImageFile(null);
//       setPreview(null);
//       navigate("/listmaster");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to add category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
//         <ImagePlus className="inline w-7 h-7 mb-1 text-violet-600" /> Add Master
//         Category
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Category Name
//           </label>
//           <input
//             type="text"
//             placeholder="e.g., Electronics"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
//           />
//         </div>

//         {/* Image upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Category Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-violet-600 file:text-white hover:file:bg-violet-700 transition"
//           />
//           {preview && (
//             <div className="mt-3">
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="w-24 h-24 object-cover rounded shadow-md border border-gray-300 dark:border-gray-700"
//               />
//             </div>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full flex justify-center items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50"
//         >
//           <Upload className="w-5 h-5" />
//           {loading ? "Uploading..." : "Add Category"}
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { ImagePlus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddMasterCategoryPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧹 Clean blob URL on unmount or image change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !imageFile) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Upload to Cloudinary
      console.log(imageFile);

      const imageUrl = await uploadToCloudinary(imageFile);
      console.log(imageUrl);

      // Submit to backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/master-categories/add`,
        {
          name: name.trim(),
          image: imageUrl,
        }
      );

      toast.success("Master Category added");
      navigate("/listmaster");
    } catch (error) {
      console.error("Add Master Category Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        <ImagePlus className="inline w-7 h-7 mb-1 text-violet-600" />
        Add Master Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g., Electronics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-violet-600 file:text-white hover:file:bg-violet-700 transition"
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded shadow-md border border-gray-300 dark:border-gray-700"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition disabled:opacity-50"
        >
          <Upload className="w-5 h-5" />
          {loading ? "Uploading..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}
