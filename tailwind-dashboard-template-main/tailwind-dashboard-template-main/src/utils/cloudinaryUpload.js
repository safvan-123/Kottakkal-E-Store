import axios from "axios";

export const uploadToCloudinary = async (file) => {
  console.log(import.meta.env.VITE_CLOUDINARY_NAME);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", `${import.meta.env.VITE_UPLOAD_PRESET}`);
  // `${import.meta.env.VITE_API_URL}
  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_NAME
    }/image/upload`,
    formData
  );

  return res.data.secure_url;
};
