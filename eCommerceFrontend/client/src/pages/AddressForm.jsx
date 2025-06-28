import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AddressForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    altPhone: "",
    landmark: "",
    fullAddress: "",
    pincode: "",
    city: "",
  });

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/address`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data.address) setForm(data.address);
      } catch (err) {
        console.error("Error fetching address", err);
      }
    };
    fetchAddress();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/address/update`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Address saved!");
      navigate("/checkout");
    } catch (err) {
      console.error("Error saving address", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {form._id ? "Edit" : "Add"} Delivery Address
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name (Required)"
          className="p-3 border border-gray-300 rounded-md"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number (Required)"
          className="p-3 border border-gray-300 rounded-md"
          maxLength={10}
          required
        />
        <input
          name="altPhone"
          value={form.altPhone}
          onChange={handleChange}
          placeholder="Alternate Phone (Optional)"
          className="p-3 border border-gray-300 rounded-md"
          maxLength={10}
        />
        <input
          name="landmark"
          value={form.landmark}
          onChange={handleChange}
          placeholder="Landmark (Optional)"
          className="p-3 border border-gray-300 rounded-md"
        />
        <textarea
          name="fullAddress"
          value={form.fullAddress}
          onChange={handleChange}
          placeholder="Full Address (Required)"
          className="md:col-span-2 p-3 border border-gray-300 rounded-md h-24 resize-none"
          required
        />
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode (Required)"
          className="p-3 border border-gray-300 rounded-md"
          maxLength={6}
          required
        />
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City (Required)"
          className="p-3 border border-gray-300 rounded-md"
          required
        />
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {form._id ? "Update Address" : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
