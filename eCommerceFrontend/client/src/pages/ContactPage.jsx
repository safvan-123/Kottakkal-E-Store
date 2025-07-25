import React, { useState } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        form
      );

      toast.success(data.message || "Message sent successfully!");
      setForm({ name: "", phone: "", message: "" });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const whatsappNumber = "917560929242";

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#f0f8ff] px-4 py-6 sm:py-10">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Image */}
        <div className="h-60 sm:h-96 md:h-auto">
          <img
            src="https://i.mdel.net/i/db/2023/3/1912109/1912109-800w.jpg"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div className="overflow-y-auto max-h-[70vh] sm:max-h-full">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-5">
              Contact Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 py-2 focus:outline-none bg-transparent placeholder:text-gray-500 text-sm"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 py-2 focus:outline-none bg-transparent placeholder:text-gray-500 text-sm"
              />
              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border-b border-gray-300 py-2 h-24 focus:outline-none bg-transparent placeholder:text-gray-500 text-sm resize-none"
              ></textarea>

              <button
                type="submit"
                className="mt-2 bg-blue-100 text-black px-5 py-2 text-sm rounded hover:bg-blue-200 transition"
              >
                Contact Us
              </button>
            </form>
          </div>

          <div className="mt-6 sm:mt-8 text-sm">
            <p className="text-xs text-gray-500 mb-1">
              <span className="font-semibold">Contact</span> — hiloomi@gmail.com
            </p>
            <p className="text-xs text-gray-500 mb-4">
              <span className="font-semibold">Based in</span> — Calicut, Kerala
            </p>

            {/* <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="text-green-500 text-xl hover:scale-110 transition" />
              </a>
            </div> */}
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp className="text-white text-2xl" />
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
