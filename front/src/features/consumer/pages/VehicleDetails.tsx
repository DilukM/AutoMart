import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { vehicleService } from "../../../shared/services/vehicleService";
import { type Vehicle } from "../../../shared/types/common";
import { getColorClasses } from "../../../shared/styles/colors";

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

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

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the inquiry to your backend
    alert("Thank you for your inquiry! We'll get back to you soon.");
    setShowInquiryForm(false);
    setInquiryData({ name: '', email: '', phone: '', message: '' });
  };

  if (loading) {
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
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-4xl font-bold ${getColorClasses.gradients.primaryText}`}
              >
                Vehicle Sales
              </motion.h1>
              <div className="flex items-center space-x-4">
              </div>
            </div>
          </div>
        </motion.header>
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!vehicle) {
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
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-4xl font-bold ${getColorClasses.gradients.primaryText}`}
              >
                Vehicle Sales
              </motion.h1>
              <div className="flex items-center space-x-4">
              </div>
            </div>
          </div>
        </motion.header>
        <div className="text-center py-12">
          <h3 className={`text-lg font-medium ${getColorClasses.text.primary} mb-2`}>
            Vehicle not found
          </h3>
          <button
            onClick={() => navigate("/")}
            className={`${getColorClasses.button.primary} font-medium py-2 px-4 rounded-lg`}
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

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
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-4xl font-bold ${getColorClasses.gradients.primaryText}`}
            >
              Vehicle Sales
            </motion.h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className={`${getColorClasses.button.secondary} font-medium py-2 px-4 rounded-lg`}
              >
                ← Back to Browse
              </button>
             
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Vehicle Title and Price */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <h1 className={`text-4xl font-bold ${getColorClasses.gradients.primaryText} mb-2`}>
              {vehicle.brand} {vehicle.modelName}
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}>
                {vehicle.type}
              </span>
              <span className={`text-2xl font-bold ${getColorClasses.gradients.primaryText}`}>
                ${vehicle.price.toLocaleString()}
              </span>
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
              <h2 className={`text-xl font-bold ${getColorClasses.text.primary} mb-4`}>
                Vehicle Images
              </h2>
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      src={vehicle.images[selectedImageIndex]}
                      alt={`${vehicle.brand} ${vehicle.modelName}`}
                      className="w-full h-full object-cover"
                    />
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
                            className="w-full h-full object-cover"
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
              <h2 className={`text-xl font-bold ${getColorClasses.text.primary} mb-6`}>
                Vehicle Specifications
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}>
                      Brand
                    </label>
                    <span className={`text-sm font-medium ${getColorClasses.text.primary}`}>
                      {vehicle.brand}
                    </span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}>
                      Model
                    </label>
                    <span className={`text-sm font-medium ${getColorClasses.text.primary}`}>
                      {vehicle.modelName}
                    </span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}>
                      Year
                    </label>
                    <span className={`text-sm font-medium ${getColorClasses.text.primary}`}>
                      {vehicle.year}
                    </span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}>
                      Engine Size
                    </label>
                    <span className={`text-sm font-medium ${getColorClasses.text.primary}`}>
                      {vehicle.engineSize}
                    </span>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}>
                      Color
                    </label>
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: vehicle.color.toLowerCase() }}
                      ></div>
                      <span className={`text-sm font-medium ${getColorClasses.text.primary}`}>
                        {vehicle.color}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-1`}>
                      Type
                    </label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}>
                      {vehicle.type}
                    </span>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${getColorClasses.text.secondary} mb-2`}>
                    Description
                  </label>
                  <p className={`${getColorClasses.text.primary} leading-relaxed`}>
                    {vehicle.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>Listed: {new Date(vehicle.createdAt).toLocaleDateString()}</p>
                    <p>Last Updated: {new Date(vehicle.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact/Inquiry Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-8 ${getColorClasses.border.default} border`}
          >
            <div className="text-center">
              <h2 className={`text-2xl font-bold ${getColorClasses.text.primary} mb-4`}>
                Interested in this vehicle?
              </h2>
              <p className={`text-lg ${getColorClasses.text.secondary} mb-6`}>
                Contact us for more information, pricing details, or to schedule a viewing.
              </p>

              {!showInquiryForm ? (
                <motion.button
                  onClick={() => setShowInquiryForm(true)}
                  className={`${getColorClasses.button.primary} font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleInquirySubmit}
                  className="max-w-md mx-auto space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone (Optional)"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[100px]`}
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className={`${getColorClasses.button.primary} font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex-1`}
                    >
                      Send Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInquiryForm(false)}
                      className={`${getColorClasses.button.secondary} font-medium py-3 px-6 rounded-xl transition-all duration-300`}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default VehicleDetails;