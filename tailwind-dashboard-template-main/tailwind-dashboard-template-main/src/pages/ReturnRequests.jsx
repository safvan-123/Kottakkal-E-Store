import React, { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    fetchReturnRequests();
  }, []);
  console.log(requests);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
