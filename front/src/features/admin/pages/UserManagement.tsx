import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { userService } from "../../../shared/services/userService";
import { type User, type LoginRequest } from "../../../shared/types/common";
import AdminLayout from "../../../shared/components/AdminLayout";
import { getColorClasses } from "../../../shared/styles/colors";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await userService.registerUser(newUser);
      toast.success("User created successfully!");
      setNewUser({ username: "", password: "" });
      setShowAddForm(false);
      await loadUsers();
    } catch (error: any) {
      console.error("Failed to create user:", error);
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);
        toast.success("User deleted successfully!");
        await loadUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center"
        >
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-3xl font-bold ${getColorClasses.gradients.primaryText}`}
          >
            User Management
          </motion.h1>
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${getColorClasses.button.primary} font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>{showAddForm ? "Cancel" : "Add User"}</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Add User Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl p-6 shadow-xl ${getColorClasses.border.default} border`}
          >
            <h2
              className={`text-xl font-bold ${getColorClasses.text.primary} mb-4`}
            >
              Add New User
            </h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`${getColorClasses.button.secondary} font-medium py-2 px-4 rounded-lg`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${getColorClasses.button.primary} font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl ${getColorClasses.border.default} border overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`${getColorClasses.background.card} border-b ${getColorClasses.border.default}`}
                >
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider`}
                    >
                      Username
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider`}
                    >
                      Created Date
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider`}
                    >
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`hover:${getColorClasses.background.card} transition-colors duration-200`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full ${getColorClasses.gradients.primary} flex items-center justify-center mr-4`}
                          >
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div>
                            <div
                              className={`text-sm font-bold ${getColorClasses.text.primary}`}
                            >
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${getColorClasses.text.primary}`}
                      >
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${getColorClasses.text.secondary}`}
                      >
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className={`mx-auto h-12 w-12 ${getColorClasses.text.muted} mb-4`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3
                  className={`text-sm font-medium ${getColorClasses.text.primary} mb-1`}
                >
                  No users found
                </h3>
                <p className={`text-sm ${getColorClasses.text.secondary}`}>
                  Get started by adding your first user.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default UserManagement;
