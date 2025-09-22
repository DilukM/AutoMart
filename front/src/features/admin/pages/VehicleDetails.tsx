import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { vehicleService } from "../../../shared/services/vehicleService";
import { type Vehicle } from "../../../shared/types/common";
import AdminLayout from "../../../shared/components/AdminLayout";
import { getColorClasses } from "../../../shared/styles/colors";

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      const data = await vehicleService.getVehicleById(id!);
      setVehicle(data);
    } catch (error) {
      console.error("Failed to load vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set([...prev, imageUrl]));
  };

  const handleImageLoad = () => {
    // Image loaded successfully
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </AdminLayout>
    );
  }

  if (!vehicle) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h3
            className={`text-lg font-medium ${getColorClasses.text.primary} mb-2`}
          >
            Vehicle not found
          </h3>
          <button
            onClick={() => navigate("/admin/vehicles")}
            className={`${getColorClasses.button.primary} font-medium py-2 px-4 rounded-lg`}
          >
            Back to Vehicles
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Header */}
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
            {vehicle.brand || "Unknown"} {vehicle.modelName || "Model"}
          </motion.h1>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/admin/vehicles/${id}/edit`)}
              className={`${getColorClasses.button.primary} font-medium py-2 px-4 rounded-lg`}
            >
              Edit Vehicle
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-6 ${getColorClasses.border.default} border`}
          >
            <h2
              className={`text-xl font-bold ${getColorClasses.text.primary} mb-4`}
            >
              Vehicle Images
            </h2>
            {vehicle.images && vehicle.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {imageErrors.has(vehicle.images[selectedImageIndex]) ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          Failed to load image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={vehicle.images[selectedImageIndex]}
                      alt={`${vehicle.brand} ${vehicle.modelName}`}
                      className="w-full h-full object-cover"
                      onError={() =>
                        handleImageError(vehicle.images[selectedImageIndex])
                      }
                      onLoad={() => handleImageLoad()}
                      crossOrigin="anonymous"
                    />
                  )}
                </div>
                {/* Thumbnail Images */}
                {vehicle.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {vehicle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index
                            ? "border-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover bg-gray-100 dark:bg-gray-800"
                          onError={() => handleImageError(image)}
                          onLoad={() => handleImageLoad()}
                          crossOrigin="anonymous"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className={`w-12 h-12 ${getColorClasses.text.muted}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-6 ${getColorClasses.border.default} border`}
          >
            <h2
              className={`text-xl font-bold ${getColorClasses.text.primary} mb-6`}
            >
              Vehicle Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}
                  >
                    Type
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}
                  >
                    {vehicle.type || "Unknown"}
                  </span>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}
                  >
                    Year
                  </label>
                  <span
                    className={`text-sm font-medium ${getColorClasses.text.primary}`}
                  >
                    {vehicle.year || "N/A"}
                  </span>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}
                  >
                    Brand
                  </label>
                  <span
                    className={`text-sm font-medium ${getColorClasses.text.primary}`}
                  >
                    {vehicle.brand || "Unknown"}
                  </span>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}
                  >
                    Model
                  </label>
                  <span
                    className={`text-sm font-medium ${getColorClasses.text.primary}`}
                  >
                    {vehicle.modelName || "Unknown"}
                  </span>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}
                  >
                    Engine Size
                  </label>
                  <span
                    className={`text-sm font-medium ${getColorClasses.text.primary}`}
                  >
                    {vehicle.engineSize || "N/A"}
                  </span>
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}
                  >
                    Color
                  </label>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                      style={{
                        backgroundColor: vehicle.color
                          ? vehicle.color.toLowerCase()
                          : "#ccc",
                      }}
                    ></div>
                    <span
                      className={`text-sm font-medium ${getColorClasses.text.primary}`}
                    >
                      {vehicle.color || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}
                >
                  Price
                </label>
                <span
                  className={`text-2xl font-bold ${getColorClasses.gradients.primaryText}`}
                >
                  ${vehicle.price ? vehicle.price.toLocaleString() : "0"}
                </span>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-2`}
                >
                  Description
                </label>
                <p
                  className={`${getColorClasses.text.primary} leading-relaxed`}
                >
                  {vehicle.description || "No description available."}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    Created: {new Date(vehicle.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Last Updated:{" "}
                    {new Date(vehicle.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default VehicleDetails;
