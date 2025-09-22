import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AdminLayout from "../../../shared/components/AdminLayout";
import { getColorClasses } from "../../../shared/styles/colors";

const Dashboard: React.FC = () => {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-8 ${getColorClasses.border.default} border`}
        >
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-4xl font-bold ${getColorClasses.gradients.primaryText} mb-4`}
          >
            Dashboard Overview
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${getColorClasses.text.secondary} text-lg`}
          >
            Welcome to your Vehicle Sales Management System. Monitor sales,
            manage inventory, and track analytics.
          </motion.p>
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Vehicles */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-xl p-6 ${getColorClasses.border.default} border shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`${getColorClasses.text.secondary} text-sm font-medium`}
                >
                  Total Vehicles
                </p>
                <p
                  className={`text-2xl font-bold ${getColorClasses.text.primary}`}
                >
                  247
                </p>
              </div>
            </div>
          </motion.div>

          {/* Active Listings */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-xl p-6 ${getColorClasses.border.default} border shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg
                  className={`w-8 h-8 ${getColorClasses.status.success}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`${getColorClasses.text.secondary} text-sm font-medium`}
                >
                  Active Listings
                </p>
                <p
                  className={`text-2xl font-bold ${getColorClasses.text.primary}`}
                >
                  189
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sold This Month */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-xl p-6 ${getColorClasses.border.default} border shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <svg
                  className={`w-8 h-8 ${getColorClasses.status.warning}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`${getColorClasses.text.secondary} text-sm font-medium`}
                >
                  Sold This Month
                </p>
                <p
                  className={`text-2xl font-bold ${getColorClasses.text.primary}`}
                >
                  43
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-xl p-6 ${getColorClasses.border.default} border shadow-lg`}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p
                  className={`${getColorClasses.text.secondary} text-sm font-medium`}
                >
                  Total Revenue
                </p>
                <p
                  className={`text-2xl font-bold ${getColorClasses.text.primary}`}
                >
                  $2.4M
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-8 ${getColorClasses.border.default} border`}
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`text-2xl font-bold ${getColorClasses.text.primary} mb-6`}
          >
            Quick Actions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/vehicles">
              <motion.button
                className={`w-full ${getColorClasses.button.primary} font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-2">
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span>Vehicle Management</span>
                </div>
              </motion.button>
            </Link>

            <Link to="/admin/vehicles/add">
              <motion.button
                className={`w-full ${getColorClasses.button.secondary} font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center justify-center space-x-2">
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
                  <span>Add New Vehicle</span>
                </div>
              </motion.button>
            </Link>

            <Link to="/admin/analytics">
              <motion.button
                className={`w-full ${getColorClasses.button.outline} font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center justify-center space-x-2">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span>View Analytics</span>
                </div>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;
