import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const AllContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/contact`
      );
      if (data?.success) {
        setContacts(data.contacts);
        setFilteredContacts(data.contacts);
      } else {
        setError("Failed to load contacts.");
      }
    } catch (err) {
      setError("Error fetching contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredContacts(
      contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term) ||
          c.message.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex gap-6">
        <div
          className={
            selectedContact
              ? "flex-1 overflow-x-auto"
              : "w-full overflow-x-auto"
          }
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Submissions
          </h2>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search messages..."
            className="w-full mb-6 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          {loading ? (
            <p className="text-blue-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredContacts.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-md">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, idx) => (
                  <tr
                    key={contact._id}
                    className={`border-t dark:border-gray-700 cursor-pointer ${
                      selectedContact?._id === contact._id
                        ? "bg-gray-300 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{contact.name}</td>
                    <td className="px-4 py-2">{contact.phone}</td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {contact.message}
                    </td>
                    <td className="px-4 py-2 text-center"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedContact && (
          <div className="w-1/3 bg-gray-50 dark:bg-gray-700 rounded-md p-6 shadow-md text-gray-800 dark:text-gray-200">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 text-center text-gray-900 dark:text-white">
              {selectedContact.name}
            </h3>
            <p>
              <strong>Phone:</strong> {selectedContact.phone}
            </p>
            <p>
              <strong>Message:</strong> {selectedContact.message}
            </p>

            <button
              onClick={() => setSelectedContact(null)}
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

export default AllContacts;
