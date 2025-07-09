import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const OfferProducts = () => {
  const [searchParams] = useSearchParams();
  const pageFromQuery = searchParams.get("page");
  const [offerProducts, setOfferProducts] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // can make dynamic
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [newOfferPercentage, setNewOfferPercentage] = useState("");
  console.log(selectedOffer);

  // Fetch offer products
  const fetchOffers = async (currentPage = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/offer-products/getoffer-products?page=${currentPage}&limit=${limit}`
      );

      if (data.success) {
        setOfferProducts(data);
        setFilteredOffers(data.offerProducts);
        setPagination(data.pagination);
        setPage(currentPage);
      } else {
        setError("Failed to load offer products.");
      }
    } catch (err) {
      setError("Error fetching offer products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentPage = parseInt(pageFromQuery) || 1;
    fetchOffers(currentPage);
  }, [pageFromQuery]);
  console.log(offerProducts);

  // Search handler
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();

    setSearchTerm(term);
    setFilteredOffers(
      offerProducts?.offerProducts?.filter(
        (offer) =>
          offer?.product?.name.toLowerCase().includes(term) ||
          offer.product?.masterCategory?.name.toLowerCase().includes(term)
      )
    );
  };

  // Calculate price after offer
  const calculateOfferPrice = (price, offer) => price - (price * offer) / 100;
  // console.log(selectedOffer);

  // Update offer percentage
  const handleUpdateOffer = async () => {
    if (!newOfferPercentage || isNaN(newOfferPercentage)) {
      alert("Please enter a valid offer percentage");
      return;
    }
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/offer-products/${
          selectedOffer._id
        }?page=${page}`,
        { offerPercentage: Number(newOfferPercentage) }
      );

      if (data.success) {
        await fetchOffers(page);
        alert("Offer percentage updated!");
        setSelectedOffer(null);
        setNewOfferPercentage("");
      }
    } catch (err) {
      alert("Failed to update offer percentage");
    }
  };

  // Delete offer product
  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/offer-products/${id}`
      );
      if (data.success) {
        fetchOffers();
        if (selectedOffer?._id === id) setSelectedOffer(null);
        alert("Offer product deleted!");
      }
    } catch (err) {
      alert("Failed to delete offer product");
    }
  };

  // Open details panel
  const openOfferDetails = (offer) => {
    setSelectedOffer(offer);
    setNewOfferPercentage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex gap-6">
        {/* Left side: Offer Products Table */}
        <div
          className={
            selectedOffer ? "flex-1 overflow-x-auto" : "w-full overflow-x-auto"
          }
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Offer Products
          </h2>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by product or category..."
            className="w-full mb-6 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          {loading ? (
            <p className="text-blue-500">Loading offer products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredOffers.length === 0 ? (
            <p className="text-gray-500">No offer products found.</p>
          ) : (
            <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-md">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Original Price</th>
                  <th className="px-4 py-2">Offer (%)</th>
                  <th className="px-4 py-2">Offer Price</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers?.map((offer, idx) => {
                  const product = offer.product;

                  const offerPrice = calculateOfferPrice(
                    product?.price || 0,
                    offer.offerPercentage
                  );

                  return (
                    <tr
                      key={offer._id}
                      className={`border-t dark:border-gray-700 cursor-pointer ${
                        selectedOffer?._id === offer._id
                          ? "bg-gray-300 dark:bg-gray-700"
                          : ""
                      }`}
                      onClick={() => openOfferDetails(offer)}
                      title="Click to view details"
                    >
                      <td className="px-4 py-2">
                        {(page - 1) * limit + idx + 1}
                      </td>

                      <td className="px-4 py-2">
                        {product?.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{product?.name}</td>
                      {product && (
                        <td className="px-4 py-2">
                          {product?.masterCategory?.name +
                            " , " +
                            product?.subCategory?.name}
                        </td>
                      )}
                      <td className="px-4 py-2">₹{product?.price}</td>
                      <td className="px-4 py-2">{offer.offerPercentage}%</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">
                        ₹{offerPrice.toFixed(2)}
                      </td>
                      <td
                        className="px-4 py-2 text-center space-x-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedOffer(offer)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Offer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Offer"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 space-x-2 text-sm">
            <button
              onClick={() => fetchOffers(1)}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              First
            </button>

            <button
              onClick={() => fetchOffers(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-1 text-gray-800 dark:text-white font-medium">
              Page <span className="font-bold">{page}</span> of{" "}
              <span className="font-bold">{pagination.totalPages}</span>
            </span>

            <button
              onClick={() => fetchOffers(page + 1)}
              disabled={page === pagination.totalPages}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>

            <button
              onClick={() => fetchOffers(pagination.totalPages)}
              disabled={page === pagination.totalPages}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>

        {/* Right side: Offer Product Details and Edit Offer */}
        {selectedOffer && (
          <div className="w-1/3 bg-gray-50 dark:bg-gray-700 rounded-md p-6 shadow-md flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2 w-full">
              {selectedOffer.product?.name}
            </h3>

            {selectedOffer.product?.imageUrl && (
              <img
                src={selectedOffer.product.imageUrl}
                alt={selectedOffer.product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <div className="flex flex-col gap-3 text-gray-800 dark:text-gray-200 mb-6 w-full text-left">
              <p>
                <strong>Category:</strong>{" "}
                {selectedOffer.product?.masterCategory?.name} ,{" "}
                {selectedOffer.product?.subCategory?.name}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedOffer.product?.description || "No description"}
              </p>
              <p>
                <strong>Original Price:</strong> ₹{selectedOffer.product?.price}
              </p>
              <p>
                <strong>Current Offer:</strong> {selectedOffer.offerPercentage}%
              </p>
              <p className="text-green-600 font-semibold">
                <strong>Offer Price:</strong> ₹
                {calculateOfferPrice(
                  selectedOffer.product?.price,
                  selectedOffer.offerPercentage
                ).toFixed(2)}
              </p>
              <p>
                <strong>Stock:</strong> {selectedOffer.product?.quantity}
              </p>
            </div>

            <div className="w-full">
              <label
                htmlFor="offerPercentage"
                className="block font-medium mb-1 text-left"
              >
                Update Offer Percentage
              </label>
              <input
                id="offerPercentage"
                type="number"
                min="0"
                max="100"
                value={newOfferPercentage}
                onChange={(e) => setNewOfferPercentage(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Enter new offer %"
              />
              <button
                onClick={handleUpdateOffer}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
              >
                Update Offer
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedOffer(null);
                setNewOfferPercentage("");
              }}
              className="mt-6 px-3 py-2 bg-red-700 text-white rounded hover:bg-red-500 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferProducts;
