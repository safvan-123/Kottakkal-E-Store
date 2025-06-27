import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaLock, FaUnlock } from "react-icons/fa";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://kottakkal-e-store.onrender.com/api/v1/user/all-users"
      );
      if (data?.success) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        setError("Failed to load users.");
      }
    } catch (err) {
      setError("Error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    );
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 1 ? 0 : 1;
    try {
      await axios.put(
        `https://kottakkal-e-store.onrender.com/api/v1/user/update-role/${id}`,
        {
          role: newRole,
        }
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `https://kottakkal-e-store.onrender.com/api/v1/user/delete/${id}`
        );
        fetchUsers();
        if (selectedUser?._id === id) setSelectedUser(null);
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await axios.put(
        `https://kottakkal-e-store.onrender.com/api/v1/user/toggle-block/${id}`
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to toggle block status");
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex gap-6">
        {/* Left side: Users Table */}
        <div
          className={
            selectedUser ? "flex-1 overflow-x-auto" : "w-full overflow-x-auto"
          }
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            All Users
          </h2>

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search users..."
            className="w-full mb-6 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />

          {loading ? (
            <p className="text-blue-500">Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <table className="min-w-full text-sm bg-white dark:bg-gray-800 rounded-md">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-left text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`border-t dark:border-gray-700 cursor-pointer ${
                      selectedUser?._id === user._id
                        ? "bg-gray-300 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => openUserDetails(user)}
                    title="Click to view details"
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">
                      {user.role === 1 ? "Admin" : "User"}
                    </td>
                    <td className="px-4 py-2">
                      {user.blocked ? (
                        <span className="text-red-500">Blocked</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </td>
                    <td
                      className="px-4 py-2 text-center space-x-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Toggle Role"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleBlock(user._id)}
                        className={`${
                          user.blocked
                            ? "text-green-500 hover:text-green-700"
                            : "text-yellow-500 hover:text-yellow-700"
                        }`}
                        title={user.blocked ? "Unblock" : "Block"}
                      >
                        {user.blocked ? <FaUnlock /> : <FaLock />}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right side: User Details - only show if user selected */}
        {selectedUser && (
          <div className="w-1/3 bg-gray-50 dark:bg-gray-700 rounded-md p-6 shadow-md flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2 w-full">
              {selectedUser.name}
            </h3>

            <div className="flex flex-col gap-4 text-gray-800 dark:text-gray-200 mb-6">
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {selectedUser.role === 1 ? "Admin" : "User"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedUser.blocked ? "text-red-500" : "text-green-600"
                  }
                >
                  {selectedUser.blocked ? "Blocked" : "Active"}
                </span>
              </p>
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="px-2 py-1 bg-red-700 text-white rounded hover:bg-red-400 transition duration-300"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
