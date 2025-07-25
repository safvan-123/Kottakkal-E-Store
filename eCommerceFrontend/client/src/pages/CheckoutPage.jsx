import React, { useState, useEffect, useContext } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaMapMarkerAlt } from "react-icons/fa";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;
// const API_BASE_URL = "http://localhost:5050";
const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  // console.log(cartItems);
  // const [selectedaddress, setselectedAddress] = useState({});
  const [selected, setSelected] = useState(false);
  const [savedData, setsavedData] = useState({});
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    altPhone: "",
    addressLine: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  const handleClick = () => {
    setSelected((prev) => {
      const newValue = !prev;
      if (newValue == true) {
        setAddress(savedData);
      }
      return newValue;
    });
  };

  const [locationDetails, setLocationDetails] = useState(null);
  const [pincodeError, setPincodeError] = useState("");
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (currentStep === 2 || currentStep === 3) {
      const script = document.createElement("script");
      script.src = `${import.meta.env.VITE_API_URL}/v1/checkout.js`;
      script.async = true;
      script.onload = () => {
        console.log("Razorpay SDK loaded");
      };
      document.body.appendChild(script);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const handlePincodeChange = async (e) => {
    const newPincode = e.target.value;
    setAddress((prevAddress) => ({ ...prevAddress, pincode: newPincode }));
    setLocationDetails(null);
    setPincodeError("");

    if (newPincode.length === 6) {
      setLoadingPincode(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pincode/${newPincode}`
        );
        const data = await response.json();
        console.log(data[0].PostOffice);
        const office = data[0]?.PostOffice?.find(
          (item) => item.Name == address?.landmark
        );

        console.log(office);

        if (
          data &&
          data[0] &&
          data[0].Status === "Success" &&
          data[0].PostOffice.length > 0
        ) {
          const office = data[0].PostOffice.find(
            (item) => item.Name === address?.landmark
          );

          const postOffice = office || data[0].PostOffice[0];
          setLocationDetails({
            area: postOffice.Name,
            district: postOffice.District,
            state: postOffice.State,
          });
          setAddress((prevAddress) => ({
            ...prevAddress,
            city: postOffice.District,
          }));
        } else {
          setPincodeError(
            "Invalid Pincode or no details found. Please double-check."
          );
          setAddress((prevAddress) => ({ ...prevAddress, city: "" }));
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
        setPincodeError("Could not fetch pincode details. Please try again.");
        setAddress((prevAddress) => ({ ...prevAddress, city: "" }));
      } finally {
        setLoadingPincode(false);
      }
    } else if (newPincode.length > 0 && newPincode.length < 6) {
      setPincodeError("Pincode must be 6 digits long.");
      setAddress((prevAddress) => ({ ...prevAddress, city: "" }));
    } else if (newPincode.length === 0) {
      setAddress((prevAddress) => ({ ...prevAddress, city: "" }));
    }
  };

  useEffect(() => {
    if (address.pincode === "") {
      setLocationDetails(null);
      setPincodeError("");
      setAddress((prevAddress) => ({ ...prevAddress, city: "" }));
    }
  }, [address?.pincode]);
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/address`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        if (data.success) {
          setsavedData(data.address);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [token]);
  const validateAddressStep = () => {
    const name = address.name || savedData.fullName;
    const phone = address.phone || savedData.phone;
    const fullAddress = address.addressLine || savedData.fullAddress;
    const pincode = address.pincode || savedData.pincode;
    // const city = address.city || savedData.city;

    if (!name || !phone || !fullAddress || !pincode) {
      toast.error(
        "Please fill in all primary required address details (Name, Phone, Full Address, Pincode)."
      );
      return false;
    }

    if (address.pincode.length === 6) {
      if (pincodeError && !address.city) {
        toast.error(
          "The provided pincode is invalid. Please enter a valid pincode or manually enter your City."
        );
        return false;
      }
      if (!locationDetails && !pincodeError && !address.city) {
        toast.error(
          "Please provide a valid 6-digit pincode or manually enter your City."
        );
        return false;
      }
    } else if (address.pincode.length > 0 && address.pincode.length < 6) {
      toast.error("Pincode must be 6 digits long.");
      return false;
    } else if (!address.city) {
      toast.error("Please enter your City.");
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateAddressStep()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const saveOrderToBackend = async (paymentStatus, paymentInfo = {}) => {
    try {
      const orderDetails = {
        items: cartItems.map((item) => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            image: item.product.imageUrl,
            price: item.product.price,
          },
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        totalAmount: cartTotal,
        offerPrice: cartTotal,
        shippingAddress: {
          name: address.name || address?.fullName,
          phone: address.phone,
          address: `${address?.fullAddress}${
            address.landmark ? ", " + address.landmark : ""
          }`,
          city: locationDetails?.district || address.city,
          state: locationDetails?.state || address?.state,
          pincode: address.pincode,
        },
        paymentMethod: paymentStatus,
        paymentInfo: paymentInfo,
      };

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          `Order placed successfully! ${
            paymentStatus === "ONLINE"
              ? "Payment processed."
              : "Cash on Delivery selected."
          }`
        );
        clearCart();
        navigate("/ordersuccess", {
          state: { orderId: data.order._id, isPaid: data.order.isPaid },
        });
      } else {
        toast.error(
          `Failed to place order: ${
            data.message || data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error saving order to backend:", error);
      toast.error(
        "An error occurred while saving your order. Please try again."
      );
    } finally {
      setLoadingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    setLoadingOrder(true);

    if (paymentMethod === "cod") {
      await saveOrderToBackend("COD");
    } else if (paymentMethod === "online") {
      try {
        const razorpayOrderResponse = await fetch(
          `${API_BASE_URL}/api/orders/razorpay-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
            body: JSON.stringify({
              amount: cartTotal,
            }),
          }
        );

        const razorpayOrderData = await razorpayOrderResponse.json();

        if (!razorpayOrderResponse.ok || !razorpayOrderData.success) {
          throw new Error(
            razorpayOrderData.error ||
              "Failed to create Razorpay order on backend."
          );
        }

        const { order: razorpayOrder } = razorpayOrderData;

        // Step 2: Open Razorpay Checkout popup
        const options = {
          key: "rzp_test_SM2gVwvabL5PdV",
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "E-commerce Store",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response) {
            await saveOrderToBackend("ONLINE", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          prefill: {
            name: address.name || address?.fullName,
            email: "customer@example.com",
            contact: address.phone,
          },
          notes: {
            addressLine: address.addressLine || address?.fullAddress,
            landmark: address.landmark,
            city: locationDetails?.district || address.city,
            pincode: address.pincode,
            area: locationDetails?.area,
            state: locationDetails?.state,
          },
          theme: {
            color: "#4F46E5",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          toast.error(
            "Payment failed: " +
              response.error.description +
              ". Please try again."
          );
          console.error("Razorpay Payment Failed:", response.error);
          setLoadingOrder(false);
        });
      } catch (error) {
        console.error("Error during online payment process:", error);
        toast.error(
          `An error occurred during online payment: ${error.message}`
        );
        setLoadingOrder(false);
      }
    }
  };

  // const isNextStep1Disabled =
  //   currentStep === 1 &&
  //   (pincodeError ||
  //     !address.name ||
  //     !address.phone ||
  //     !address.addressLine ||
  //     !address.pincode ||
  //     (!locationDetails && !address.city));
  // const isPlaceOrderDisabled =
  //   cartItems.length === 0 ||
  //   !address.name ||
  //   !address.phone ||
  //   !address.addressLine ||
  //   !address.pincode ||
  //   (!locationDetails && !address.city) ||
  //   (pincodeError && !address.city) ||
  //   loadingOrder;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-6 sm:py-10 px-3 sm:px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-3 transform transition-all duration-300 ease-in-out">
        {/* Left Section: Steps & Content */}
        <div className="lg:col-span-2 p-6 sm:p-8 md:p-12 border-r border-gray-100">
          {currentStep == 1 && savedData ? (
            <div className="max-w-3xl mx-auto bg-white rounded-xl  sm:p-4 border border-white hover:border-transparent mb-8">
              {/* Header Section */}
              <div className="flex sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4 gap-1 sm:gap-2">
                <h2 className="text-sm sm:text-xl font-semibold text-gray-800 me-2">
                  Choose Delivery Address
                </h2>
                <button
                  className="text-blue-600 text-xs text-end sm:text-sm"
                  onClick={() => navigate("/address")}
                >
                  Change Address
                </button>
              </div>

              {/* Radio Button Section */}
              <div className="w-full">
                <label className="flex flex-row items-start gap-3 p-2 border border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition w-full">
                  {/* Left: Radio Button */}
                  <div className="pt-1">
                    <input
                      type="radio"
                      name="deliveryAddress"
                      checked={selected}
                      onClick={handleClick}
                      className="w-4 h-4 text-indigo-600"
                    />
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 flex flex-col md:flex-row gap-2 w-full">
                    {/* Left Block */}
                    <div className="w-full md:w-1/2 bg-gray-50 p-2 rounded-md shadow-sm">
                      <div className="text-gray-700 space-y-0.5 text-xs sm:text-sm leading-snug">
                        <p>
                          <span className="font-medium">Full Name:</span>{" "}
                          {savedData?.fullName}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {savedData?.phone}
                        </p>
                        <p>
                          <span className="font-medium">Alt Phone:</span>{" "}
                          {savedData?.altPhone}
                        </p>
                        <p>
                          <span className="font-medium">Landmark:</span>{" "}
                          {savedData?.landmark}
                        </p>
                      </div>
                    </div>

                    {/* Right Block */}
                    <div className="w-full md:w-1/2 bg-gray-50 p-2 rounded-md shadow-sm">
                      <div className="text-gray-700 space-y-0.5 text-xs sm:text-sm leading-snug">
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {savedData?.fullAddress}
                        </p>
                        <p>
                          <span className="font-medium">City:</span>{" "}
                          {savedData?.city}
                        </p>
                        <p>
                          <span className="font-medium">Pincode:</span>{" "}
                          {savedData?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <>
              {currentStep == 1 && (
                <div
                  className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow border border-gray-200"
                  style={{ marginBottom: "30px" }}
                >
                  <div className="text-blue-600 text-2xl mb-2">
                    <FaMapMarkerAlt />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    No Delivery Address Found
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-4 px-2">
                    You haven’t added a delivery address yet. Please add one to
                    continue.
                  </p>
                  <button
                    onClick={() => navigate("/address")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition duration-300"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </>
          )}

          {/* </div> This closing div seems to be misplaced if it's not opening another element. */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-10 text-center px-4">
            Place Your Order
          </h1>

          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-8 sm:mb-10 relative px-4 sm:px-0 max-w-xl mx-auto">
            {/* Progress Bar Track */}
            <div className="absolute left-0 right-0 h-1.5 bg-gray-200 z-0 mx-4 sm:mx-6 rounded-full"></div>
            {/* Progress Bar Fill */}
            <div
              className={`absolute left-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 z-10 transition-all duration-500 ease-in-out rounded-full`}
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>

            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className="relative z-20 flex flex-col items-center flex-1 mx-2 sm:mx-0" /* Added flex-1 and mx-2 for better spacing on small screens */
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl transition-all duration-300 ease-in-out transform
                                ${
                                  currentStep >= stepNum
                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                                    : "bg-gray-300"
                                }
                                ${
                                  currentStep === stepNum
                                    ? "scale-110 ring-4 ring-indigo-200"
                                    : ""
                                }
                            `}
                >
                  {stepNum}
                </div>
                <p
                  className={`mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-center ${
                    /* Adjusted font size and added text-center */
                    currentStep >= stepNum ? "text-indigo-700" : "text-gray-500"
                  }`}
                >
                  {stepNum === 1 && "Delivery Address"}
                  {stepNum === 2 && "Payment Method"}
                  {stepNum === 3 && "Order Review"}
                </p>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="mt-12 animate-fade-in">
            {/* Step 1: Delivery Address */}
            {currentStep === 1 && (
              <div className="max-w-3xl mx-auto bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200 ">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Where should we deliver?
                </h2>

                <div className="grid grid-cols-1 pt-4 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <input
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Full Name (Required)"
                    defaultValue={selected ? savedData?.fullName : ""}
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                    required
                  />

                  {/* Phone Number */}
                  <input
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Phone Number (Required)"
                    defaultValue={selected ? savedData?.phone : ""}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    maxLength="10"
                    required
                  />

                  {/* Alternate Phone */}
                  <input
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Alternate Phone (Optional)"
                    defaultValue={selected ? savedData?.altPhone : ""}
                    onChange={(e) =>
                      setAddress({ ...address, altPhone: e.target.value })
                    }
                    maxLength="10"
                  />

                  {/* Landmark */}
                  <input
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Landmark (e.g., Near City Hospital)"
                    defaultValue={selected ? savedData?.landmark : ""}
                    onChange={(e) =>
                      setAddress({ ...address, landmark: e.target.value })
                    }
                  />

                  {/* Full Address */}
                  <input
                    className="sm:col-span-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Full Address (House No., Street, Locality - Required)"
                    defaultValue={selected ? savedData?.fullAddress : ""}
                    onChange={(e) =>
                      setAddress({ ...address, addressLine: e.target.value })
                    }
                    required
                  />

                  {/* Pincode with Spinner */}
                  <div className="relative">
                    <input
                      className="p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                      placeholder="Pincode (Required)"
                      defaultValue={selected ? savedData?.pincode : ""}
                      onChange={handlePincodeChange}
                      maxLength="6"
                      required
                    />
                    {loadingPincode && (
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          className="animate-spin h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <input
                    className={`p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                      !!locationDetails && !pincodeError
                        ? "bg-gray-100 text-gray-700 cursor-not-allowed focus:ring-gray-300"
                        : "focus:ring-blue-400"
                    }`}
                    placeholder="City (Auto-filled or Manual)"
                    defaultValue={
                      selected
                        ? locationDetails?.district || savedData.city
                        : ""
                    }
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    readOnly={!!locationDetails && !pincodeError}
                    required={!locationDetails}
                  />
                </div>

                {/* Location Details */}
                {locationDetails && (
                  <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>
                      <strong className="text-gray-800">Area:</strong>{" "}
                      {locationDetails.area},
                      <strong className="ml-2 text-gray-800">District:</strong>{" "}
                      {locationDetails.district},
                      <strong className="ml-2 text-gray-800">State:</strong>{" "}
                      {locationDetails.state || address?.state}
                    </p>
                  </div>
                )}

                {/* Pincode Error */}
                {pincodeError && (
                  <div className="mt-2 text-red-600 text-sm font-medium flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {pincodeError}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="space-y-7">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  How would you like to pay?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label
                    className={`payment-option ${
                      paymentMethod === "cod" ? "selected" : ""
                    } border border-gray-300 rounded-lg p-5 flex items-center cursor-pointer transition-all duration-200 ease-in-out hover:border-indigo-500 hover:shadow-md`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          paymentMethod === "cod"
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-gray-400"
                        }`}
                      >
                        {paymentMethod === "cod" && (
                          <span className="block w-3 h-3 rounded-full bg-white"></span>
                        )}
                      </span>
                      <span className="text-lg font-semibold text-gray-800">
                        <svg
                          className="w-7 h-7 inline-block mr-2 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-1.25-3M15 10V5.75L12 4 9 5.75V10m6 0h2c2 0 2 2 0 2H7c-2 0-2-2 0-2h2m6 0c0 2-2 2-2 0H9c0 2-2 2-2 0"
                          ></path>
                        </svg>
                        Cash on Delivery
                      </span>
                    </div>
                  </label>
                </div>
                {paymentMethod === "online" && (
                  <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2 mt-4">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    You've selected online payment. You will be redirected to
                    Razorpay securely.
                  </div>
                )}
                {paymentMethod === "cod" && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm font-medium flex items-center gap-2 mt-4">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    You've selected Cash on Delivery. Pay at your doorstep!
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <div className="space-y-5 sm:space-y-7">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Final Check of Your Order
                </h2>

                {/* Address Details for Review */}
                <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2 sm:mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    Delivery To
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    <strong className="font-medium">Name:</strong>{" "}
                    {savedData.fullName}
                    <br />
                    <strong className="font-medium">Phone:</strong>{" "}
                    {savedData.phone}
                    <br />
                    <strong className="font-medium">Address:</strong>{" "}
                    {savedData.addressLine},{" "}
                    {savedData.landmark ? `${savedData.landmark}, ` : ""}
                    {locationDetails?.area || ""},{" "}
                    {locationDetails?.district || address.city},{" "}
                    {/* {locationDetails?.state || ""} - {savedData.pincode} */}
                  </p>
                  <p className="text-gray-700 text-sm sm:text-base mt-2 sm:mt-3">
                    <strong className="font-medium">Payment Method:</strong>{" "}
                    <span className="font-semibold text-indigo-700">
                      {paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment (Razorpay)"}
                    </span>
                  </p>
                </div>

                {/* Cart Items for Review */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    ></path>
                  </svg>
                  Items in Your Cart
                </h3>
                <div className="space-y-3 sm:space-y-4 max-h-72 sm:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">
                      Your cart is empty.
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={`${item.product._id}-${item.size || ""}-${
                          item.color || ""
                        }`}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border border-gray-200 shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-base sm:text-lg text-gray-800">
                              {item.product.name}
                            </p>
                            <p className="text-sm sm:text-md text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            {(item.size || item.color) && (
                              <p className="text-xs sm:text-sm text-gray-500">
                                {item.size && `Size: ${item.size}`}
                                {item.size && item.color && ", "}
                                {item.color && `Color: ${item.color}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold text-base sm:text-lg text-gray-900">
                          {formatPrice(item.quantity * item.product.price)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}

            <div
              className={`mt-6 sm:mt-12 flex flex-row flex-wrap gap-3 ${
                currentStep === 1 ? "justify-end" : "justify-between"
              }`}
            >
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition duration-200 text-sm sm:text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 mr-2 -ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Previous
                </button>
              )}

              {currentStep < 3 && (
                <button
                  onClick={handleNextStep}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm sm:text-lg font-medium shadow-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 ml-2 -mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              )}

              {currentStep === 3 && (
                <button
                  onClick={handlePlaceOrder}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600 text-white text-sm sm:text-lg font-bold shadow-lg hover:from-green-600 hover:to-teal-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingOrder ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 sm:w-5 h-4 sm:h-5 mr-2 -ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  )}
                  {loadingOrder ? "Placing Order..." : "Place Order"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Order Summary (Sticky) */}
        <div className="lg:col-span-1 p-5 sm:p-6 md:p-10 bg-gradient-to-b from-indigo-500 to-blue-600 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-6 sm:mb-8 border-b border-indigo-400 pb-3 sm:pb-4 text-center">
              Order Summary
            </h2>

            <div className="space-y-5 sm:space-y-6">
              {cartItems.length === 0 ? (
                <p className="text-indigo-100 text-center py-6 sm:py-8 text-sm sm:text-base">
                  Your cart is empty. Add items to see summary.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.product._id}-summary-${item.size || ""}-${
                      item.color || ""
                    }`}
                    className="flex items-center justify-between border-b border-indigo-400 pb-3"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-base sm:text-lg">
                        {item.product.name}
                      </p>
                      <p className="text-indigo-200 text-xs sm:text-sm">
                        Qty: {item.quantity}
                      </p>
                      {(item.size || item.color) && (
                        <p className="text-indigo-200 text-xs">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ", "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-base sm:text-lg whitespace-nowrap">
                      {formatPrice(item.quantity * item.product.price)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t-2 border-indigo-400">
            <div className="flex justify-between items-center text-lg sm:text-2xl font-bold mb-3 sm:mb-4">
              <span>Total:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-indigo-200 text-xs sm:text-sm text-center">
              Shipping calculated at the next stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
