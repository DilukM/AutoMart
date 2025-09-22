import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { vehicleService } from "../../../shared/services/vehicleService";
import {
  type VehicleType,
  type PaginatedVehiclesResponse,
  type VehicleApiFilters,
} from "../../../shared/types/common";
import AdminLayout from "../../../shared/components/AdminLayout";
import { getColorClasses } from "../../../shared/styles/colors";

const VehicleManagement: React.FC = () => {
  const [vehiclesData, setVehiclesData] = useState<PaginatedVehiclesResponse>({
    vehicles: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<VehicleApiFilters>({
    type: undefined,
    brand: undefined,
    modelName: undefined,
    color: undefined,
    engineSize: undefined,
    yearMin: undefined,
    yearMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });

  useEffect(() => {
    loadVehicles();
  }, [page, limit, filters]);

  const loadVehicles = async () => {
    try {
      const apiFilters: VehicleApiFilters = {
        page,
        limit,
        ...filters,
      };
      const data = await vehicleService.getVehicles(apiFilters);
      setVehiclesData(data);
    
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      // Reset to empty state on error
      setVehiclesData({
        vehicles: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await vehicleService.deleteVehicle(id);
        await loadVehicles();
      } catch (error) {
        console.error("Failed to delete vehicle:", error);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      type: undefined,
      brand: undefined,
      modelName: undefined,
      color: undefined,
      engineSize: undefined,
      yearMin: undefined,
      yearMax: undefined,
      priceMin: undefined,
      priceMax: undefined,
    });
    setPage(1);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col h-screen w-full max-w-full overflow-hidden space-y-4"
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
            Vehicle Management
          </motion.h1>
          <Link to="/admin/vehicles/add">
            <motion.button
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
                <span>Add Vehicle</span>
              </div>
            </motion.button>
          </Link>
        </motion.div>

        {/* Filters Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-between items-center"
        >
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`${getColorClasses.button.secondary} font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </div>
          </motion.button>
          <span className={`text-sm ${getColorClasses.text.secondary}`}>
            {vehiclesData.total} vehicle
            {vehiclesData.total !== 1 ? "s" : ""} found
          </span>
        </motion.div>

        {/* Filters Section */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl p-6 shadow-xl ${getColorClasses.border.default} border mb-6`}
          >
            {/* Filter Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <select
                value={filters.type || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    type: e.target.value
                      ? (e.target.value as VehicleType)
                      : undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">All Types</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <input
                type="text"
                placeholder="Brand"
                value={filters.brand || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    brand: e.target.value || undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />

              <input
                type="number"
                placeholder="Min Price"
                value={filters.priceMin || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    priceMin: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.priceMax || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    priceMax: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />

              <input
                type="text"
                placeholder="Model"
                value={filters.modelName || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    modelName: e.target.value || undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />

              <input
                type="text"
                placeholder="Color"
                value={filters.color || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    color: e.target.value || undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />

              <input
                type="text"
                placeholder="Engine Size"
                value={filters.engineSize || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    engineSize: e.target.value || undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />

              <input
                type="number"
                placeholder="Min Year"
                value={filters.yearMin || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    yearMin: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }));
                  setPage(1); 
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />

              <input
                type="number"
                placeholder="Max Year"
                value={filters.yearMax || ""}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    yearMax: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }));
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className={`px-4 py-2 rounded-lg ${getColorClasses.button.secondary} text-sm font-medium transition-colors hover:opacity-80`}
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Vehicle Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="block lg:hidden flex-1 overflow-hidden max-h-[calc(100vh-200px)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 h-full overflow-y-auto"
              >
                {vehiclesData.vehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl ${getColorClasses.border.default} border p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-lg ${getColorClasses.gradients.primary} flex items-center justify-center mr-4`}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 14l-5 5l-7-7-3-3 1.5-1.5L9 12l8.5-8.5L19 5v9z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div
                            className={`text-lg font-bold ${getColorClasses.text.primary}`}
                          >
                            {vehicle.brand} {vehicle.modelName}
                          </div>
                          <div
                            className={`text-sm ${getColorClasses.text.secondary} mb-2 line-clamp-3`}
                          >
                            {vehicle.description}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}
                            >
                              {vehicle.type}
                            </span>
                            <span
                              className={`${getColorClasses.text.secondary}`}
                            >
                              {vehicle.year}
                            </span>
                            <span
                              className={`${getColorClasses.text.secondary}`}
                            >
                              {vehicle.engineSize}
                            </span>
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                                style={{
                                  backgroundColor: vehicle.color.toLowerCase(),
                                }}
                              ></div>
                              <span
                                className={`${getColorClasses.text.secondary}`}
                              >
                                {vehicle.color}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-lg font-bold ${getColorClasses.gradients.primaryText} ml-4`}
                      >
                        ${vehicle.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/admin/vehicles/${vehicle.id}`}
                        className="flex-1"
                      >
                        <button
                          className={`w-full ${getColorClasses.button.primary} hover:opacity-80 font-medium flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>View</span>
                        </button>
                      </Link>
                      <Link
                        to={`/admin/vehicles/${vehicle.id}/edit`}
                        className="flex-1"
                      >
                        <button
                          className={`w-full ${getColorClasses.text.primary} hover:opacity-80 font-medium flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/20`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>Edit</span>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className={`flex-1 ${getColorClasses.status.error} hover:opacity-80 font-medium flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/20`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}

                {vehiclesData.vehicles.length === 0 && (
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
                        d="M19 11H5m14-7H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
                      />
                    </svg>
                    <h3
                      className={`text-sm font-medium ${getColorClasses.text.primary} mb-1`}
                    >
                      No vehicles found
                    </h3>
                    <p className={`text-sm ${getColorClasses.text.secondary}`}>
                      Get started by adding your first vehicle.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Desktop Table Layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`hidden lg:block ${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl ${getColorClasses.border.default} border overflow-hidden flex-1 max-h-[calc(100vh-200px)] w-full max-w-full`}
            >
              <div className="overflow-auto h-full max-h-full w-full">
                <table className="w-full table-fixed">
                  <thead
                    className={`${getColorClasses.background.card} border-b ${getColorClasses.border.default}`}
                  >
                    <tr>
                      <th
                        className={`px-4 sm:px-6 py-4 text-left text-sm font-semibold overflow-hidden ${getColorClasses.text.primary} uppercase tracking-wider w-1/4`}
                      >
                        Vehicle
                      </th>
                      <th
                        className={`px-4 sm:px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider w-16`}
                      >
                        Type
                      </th>
                      <th
                        className={`px-4 sm:px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider w-16`}
                      >
                        Year
                      </th>
                      <th
                        className={`px-4 sm:px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider hidden md:table-cell w-20`}
                      >
                        Engine
                      </th>
                      <th
                        className={`px-4 sm:px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider hidden lg:table-cell w-28`}
                      >
                        Color
                      </th>
                      <th
                        className={`px-4 sm:px-6 py-4 text-left text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider w-24`}
                      >
                        Price
                      </th>
                      <th
                        className={`px-4 sm:px-6 py-4 text-center text-sm font-semibold ${getColorClasses.text.primary} uppercase tracking-wider w-24`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {vehiclesData.vehicles.map((vehicle, index) => (
                      <motion.tr
                        key={vehicle.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`hover:${getColorClasses.background.card} transition-colors duration-200`}
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${getColorClasses.gradients.primary} flex items-center justify-center mr-3 sm:mr-4`}
                            >
                              <img
                                src={vehicle.images[0]}
                                alt={`${vehicle.brand} ${vehicle.modelName}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div>
                              <div
                                className={`text-sm font-bold ${getColorClasses.text.primary}`}
                              >
                                {vehicle.brand} {vehicle.modelName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${getColorClasses.text.primary}`}
                        >
                          <span
                            className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}
                          >
                            {vehicle.type}
                          </span>
                        </td>
                        <td
                          className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${getColorClasses.text.primary}`}
                        >
                          {vehicle.year}
                        </td>
                        <td
                          className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${getColorClasses.text.secondary} hidden md:table-cell`}
                        >
                          {vehicle.engineSize}
                        </td>
                        <td
                          className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm ${getColorClasses.text.secondary} hidden lg:table-cell`}
                        >
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                              style={{
                                backgroundColor: vehicle.color.toLowerCase(),
                              }}
                            ></div>
                            {vehicle.color}
                          </div>
                        </td>
                        <td
                          className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-bold ${getColorClasses.gradients.primaryText}`}
                        >
                          ${vehicle.price.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link to={`/admin/vehicles/${vehicle.id}`}>
                              <button
                                className={`${getColorClasses.button.primary} hover:opacity-80 font-medium flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                            </Link>
                            <Link to={`/admin/vehicles/${vehicle.id}/edit`}>
                              <button
                                className={`${getColorClasses.text.primary} hover:opacity-80 font-medium flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/20 w-full sm:w-auto`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(vehicle.id)}
                              className={`${getColorClasses.status.error} hover:opacity-80 font-medium flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 w-full sm:w-auto`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {vehiclesData.vehicles.length === 0 && (
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
                      d="M19 11H5m14-7H5a2 2 0 00-2 2v11a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
                    />
                  </svg>
                  <h3
                    className={`text-sm font-medium ${getColorClasses.text.primary} mb-1`}
                  >
                    No vehicles found
                  </h3>
                  <p className={`text-sm ${getColorClasses.text.secondary}`}>
                    Get started by adding your first vehicle.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Pagination */}
        {vehiclesData.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl p-4 shadow-xl ${getColorClasses.border.default} border mt-6`}
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${getColorClasses.text.secondary}`}>
                    Items per page:
                  </span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value));
                      setPage(1);
                    }}
                    className={`px-2 py-1 rounded ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 text-sm`}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Jump to page */}
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${getColorClasses.text.secondary}`}>
                    Go to page:
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={vehiclesData.totalPages}
                    value={page}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      if (newPage >= 1 && newPage <= vehiclesData.totalPages) {
                        setPage(newPage);
                      }
                    }}
                    className={`w-16 px-2 py-1 text-center rounded ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 text-sm`}
                  />
                  <span className={`text-sm ${getColorClasses.text.secondary}`}>
                    of {vehiclesData.totalPages}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-sm ${getColorClasses.text.secondary}`}>
                  Page {vehiclesData.page} of {vehiclesData.totalPages} (
                  {vehiclesData.total} total)
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className={`px-2 sm:px-3 py-1 rounded ${getColorClasses.button.secondary} text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  First
                </button>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-2 sm:px-3 py-1 rounded ${getColorClasses.button.secondary} text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  ‹ Prev
                </button>

                {/* Page number buttons */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const startPage = Math.max(1, page - 2);
                    const endPage = Math.min(vehiclesData.totalPages, page + 2);

                    // Add ellipsis for large page ranges
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setPage(1)}
                          className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${getColorClasses.button.secondary} hover:opacity-80`}
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(
                          <span key="start-ellipsis" className={`px-2 py-1 text-xs sm:text-sm ${getColorClasses.text.secondary}`}>
                            ...
                          </span>
                        );
                      }
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                            i === page
                              ? `${getColorClasses.button.primary} text-white`
                              : `${getColorClasses.button.secondary} hover:opacity-80`
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    if (endPage < vehiclesData.totalPages) {
                      if (endPage < vehiclesData.totalPages - 1) {
                        pages.push(
                          <span key="end-ellipsis" className={`px-2 py-1 text-xs sm:text-sm ${getColorClasses.text.secondary}`}>
                            ...
                          </span>
                        );
                      }
                      pages.push(
                        <button
                          key={vehiclesData.totalPages}
                          onClick={() => setPage(vehiclesData.totalPages)}
                          className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${getColorClasses.button.secondary} hover:opacity-80`}
                        >
                          {vehiclesData.totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === vehiclesData.totalPages}
                  className={`px-2 sm:px-3 py-1 rounded ${getColorClasses.button.secondary} text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next ›
                </button>
                <button
                  onClick={() => setPage(vehiclesData.totalPages)}
                  disabled={page === vehiclesData.totalPages}
                  className={`px-2 sm:px-3 py-1 rounded ${getColorClasses.button.secondary} text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Last
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default VehicleManagement;
