import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReturnRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  //   const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

  const fetchReturnRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${API_BASE_URL}/api/orders/allreturns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      if (data.success) setRequests(data.requests);
      else setError("Failed to fetch return requests.");
    } catch (err) {
      console.error(err);
      setError("Error loading return requests.");
    }
  };

  const updateReturnDeliveryStatus = async (
    orderMongoId,
    productId,
    isDelivered
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/orders/return-status/${orderMongoId}/${productId}`,
        { isDelivered },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Return delivery status updated");
      fetchReturnRequests(); // refresh the list
    } catch (err) {
      console.error("❌ Failed to update return status:", err);
      toast.error("Failed to update return delivery status");
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);
  console.log(requests);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Return Requests
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
              <th className="px-4 py-2">Order Id</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Note</th>
              <th className="px-4 py-2">Requested On</th>
              <th className="px-4 py-2">Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr key={"test"}>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-600 dark:text-gray-400"
                >
                  No return requests found.
                </td>
              </tr>
            ) : (
              requests.map((req, ind) => (
                <tr
                  key={ind}
                  className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-2">{req.orderId}</td>
                  <td className="px-4 py-2">
                    {req.user?.name} ({req.user?.phone},{req.user?.address})
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={req.product?.imageUrl}
                        alt={req.product?.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{req.product?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{req.reason}</td>
                  <td className="px-4 py-2">{req.customNote || "-"}</td>
                  <td className="px-4 py-2">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={req.isDelivered}
                        onChange={(e) =>
                          updateReturnDeliveryStatus(
                            req.orderMongoId,
                            req.product?._id,
                            e.target.checked
                          )
                        }
                      />
                      <span className="text-sm">Delivered</span>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnRequests;
