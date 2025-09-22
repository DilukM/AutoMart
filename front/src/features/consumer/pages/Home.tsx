import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getColorClasses } from "../../../shared/styles/colors";
import { vehicleService } from "../../../shared/services/vehicleService";
import { type Vehicle, type VehicleType } from "../../../shared/types/common";

const Home: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "" as VehicleType | "",
    brand: "",
    modelName: "",
    color: "",
    engineSize: "",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      searchQuery === "" ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filters.type === "" || vehicle.type === filters.type;
    const matchesBrand =
      filters.brand === "" ||
      vehicle.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesModel =
      filters.modelName === "" ||
      vehicle.modelName.toLowerCase().includes(filters.modelName.toLowerCase());
    const matchesColor =
      filters.color === "" ||
      vehicle.color.toLowerCase().includes(filters.color.toLowerCase());
    const matchesEngine =
      filters.engineSize === "" ||
      vehicle.engineSize
        .toLowerCase()
        .includes(filters.engineSize.toLowerCase());
    const matchesYearMin =
      filters.yearMin === "" || vehicle.year >= parseInt(filters.yearMin);
    const matchesYearMax =
      filters.yearMax === "" || vehicle.year <= parseInt(filters.yearMax);
    const matchesPriceMin =
      filters.priceMin === "" || vehicle.price >= parseInt(filters.priceMin);
    const matchesPriceMax =
      filters.priceMax === "" || vehicle.price <= parseInt(filters.priceMax);

    return (
      matchesSearch &&
      matchesType &&
      matchesBrand &&
      matchesModel &&
      matchesColor &&
      matchesEngine &&
      matchesYearMin &&
      matchesYearMax &&
      matchesPriceMin &&
      matchesPriceMax
    );
  });

  const clearFilters = () => {
    setFilters({
      type: "",
      brand: "",
      modelName: "",
      color: "",
      engineSize: "",
      yearMin: "",
      yearMax: "",
      priceMin: "",
      priceMax: "",
    });
    setSearchQuery("");
  };

  return (
    <div className={getColorClasses.background.main}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${getColorClasses.background.glass} backdrop-blur-lg shadow-lg ${getColorClasses.border.default} border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/">
              <img src="/logo.svg" alt="Logo" className="w-30" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <motion.button
                  className={`${getColorClasses.button.primary} font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl p-6 shadow-xl ${getColorClasses.border.default} border mb-8`}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search vehicles by brand, model, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${getColorClasses.text.secondary}`}
              >
                View:
              </span>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-l-lg transition-colors ${
                    viewMode === "grid"
                      ? `${getColorClasses.button.primary} text-white`
                      : `${getColorClasses.background.card} ${getColorClasses.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                  }`}
                >
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-r-lg transition-colors ${
                    viewMode === "list"
                      ? `${getColorClasses.button.primary} text-white`
                      : `${getColorClasses.background.card} ${getColorClasses.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                  }`}
                >
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
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  type: e.target.value as VehicleType,
                }))
              }
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
              value={filters.brand}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, brand: e.target.value }))
              }
              className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
            />

            <input
              type="text"
              placeholder="Model"
              value={filters.modelName}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, modelName: e.target.value }))
              }
              className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
            />

            <input
              type="text"
              placeholder="Color"
              value={filters.color}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, color: e.target.value }))
              }
              className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
            />

            <input
              type="text"
              placeholder="Engine Size"
              value={filters.engineSize}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, engineSize: e.target.value }))
              }
              className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
            />

            <input
              type="number"
              placeholder="Min Year"
              value={filters.yearMin}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, yearMin: e.target.value }))
              }
              className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
            />

            <input
              type="number"
              placeholder="Max Year"
              value={filters.yearMax}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, yearMax: e.target.value }))
              }
              className={`px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
            />

            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
                }
                className={`w-full px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
                }
                className={`w-full px-3 py-2 rounded-lg ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className={`text-sm ${getColorClasses.text.secondary}`}>
              {filteredVehicles.length} vehicle
              {filteredVehicles.length !== 1 ? "s" : ""} found
            </span>
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-lg ${getColorClasses.button.secondary} text-sm font-medium transition-colors hover:opacity-80`}
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Vehicles Display */}
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={
                  viewMode === "grid"
                    ? `${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl ${getColorClasses.border.default} border overflow-hidden hover:scale-105 transition-transform duration-300`
                    : `${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl ${getColorClasses.border.default} border p-6 hover:shadow-2xl transition-shadow duration-300`
                }
              >
                <Link to={`/vehicle/${vehicle.id}`}>
                  {viewMode === "grid" ? (
                    // Grid View
                    <div className="aspect-square relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={vehicle.images[0] || "/placeholder-car.jpg"}
                        alt={`${vehicle.brand} ${vehicle.modelName}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {vehicle.type}
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex space-x-4">
                      <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={vehicle.images[0] || "/placeholder-car.jpg"}
                          alt={`${vehicle.brand} ${vehicle.modelName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className={`text-lg font-bold ${getColorClasses.text.primary}`}
                            >
                              {vehicle.brand} {vehicle.modelName}
                            </h3>
                            <p
                              className={`text-sm ${getColorClasses.text.secondary} mt-1`}
                            >
                              {vehicle.year} • {vehicle.engineSize} •{" "}
                              {vehicle.color}
                            </p>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}
                          >
                            {vehicle.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common content for both views */}
                  <div className={viewMode === "grid" ? "p-4" : "mt-4"}>
                    <h3
                      className={`font-bold ${getColorClasses.text.primary} mb-2`}
                    >
                      {vehicle.brand} {vehicle.modelName}
                    </h3>
                    <p
                      className={`text-sm ${getColorClasses.text.secondary} mb-3 line-clamp-2`}
                    >
                      {vehicle.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-lg font-bold ${getColorClasses.gradients.primaryText}`}
                      >
                        ${vehicle.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-sm ${getColorClasses.text.secondary}`}
                      >
                        {vehicle.year}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredVehicles.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
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
              className={`text-lg font-medium ${getColorClasses.text.primary} mb-2`}
            >
              No vehicles found
            </h3>
            <p className={`text-sm ${getColorClasses.text.secondary}`}>
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Home;
