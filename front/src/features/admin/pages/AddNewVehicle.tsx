import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AdminLayout from "../../../shared/components/AdminLayout";
import { getColorClasses } from "../../../shared/styles/colors";
import type { VehicleType } from "../../../shared/types/common";
import { vehicleService } from "../../../shared/services/vehicleService";

interface VehicleFormData {
  type: VehicleType;
  brand: string;
  modelName: string;
  color: string;
  engineSize: string;
  year: number;
  price: number;
  images: File[];
  description: string;
}

const AddNewVehicle: React.FC = () => {
  const [formData, setFormData] = useState<VehicleFormData>({
    type: "Car" as VehicleType,
    brand: "",
    modelName: "",
    color: "",
    engineSize: "",
    year: new Date().getFullYear(),
    price: 0,
    images: [],
    description: "",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files);
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10), // Max 10 images
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const generateAIDescription = async () => {
    setIsGenerating(true);
    try {
      const response = await vehicleService.generateDescription({
        type: formData.type,
        brand: formData.brand,
        modelName: formData.modelName,
        color: formData.color,
        engineSize: formData.engineSize,
        year: formData.year,
        price: formData.price,
      });

      // Extract description from response.description as confirmed by user
      const description = response?.data.description || "";

      if (description) {
        setFormData((prev) => ({ ...prev, description }));
        toast.success("AI description generated successfully!");
      } else {
        console.error("No description found in response:", response);
        toast.error("Failed to generate AI description. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
      toast.error("Failed to generate AI description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("type", formData.type);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("modelName", formData.modelName);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("engineSize", formData.engineSize);
      formDataToSend.append("year", formData.year.toString());
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("description", formData.description);
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      await vehicleService.createVehicle(formDataToSend);
      toast.success("Vehicle added successfully!");
      // Reset form or redirect
      setFormData({
        type: "Car" as VehicleType,
        brand: "",
        modelName: "",
        color: "",
        engineSize: "",
        year: new Date().getFullYear(),
        price: 0,
        images: [],
        description: "",
      });
      setImagePreviews([]);
    } catch (error: any) {
      console.error("Failed to create vehicle:", error);
      if (error.response) {
        console.error("Backend error response:", error.response.data);
      }
      toast.error("Failed to add vehicle. Please try again.");
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
          className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-6 ${getColorClasses.border.default} border`}
        >
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-3xl font-bold ${getColorClasses.gradients.primaryText} mb-2`}
          >
            Add New Vehicle
          </motion.h1>
          <p className={`${getColorClasses.text.secondary} text-lg`}>
            Add a new vehicle to your inventory with AI-powered description
            generation
          </p>
        </motion.div>

        {/* Vehicle Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`relative ${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-8 ${getColorClasses.border.default} border`}
        >
          {/* Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl flex flex-col items-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Generating AI Description
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Please wait while we create a description for your vehicle...
                  </p>
                </div>
              </motion.div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    handleInputChange("type", e.target.value as VehicleType)
                  }
                  className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Model Name
                </label>
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) =>
                    handleInputChange("modelName", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., Camry"
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    handleInputChange("year", parseInt(e.target.value))
                  }
                  className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value))
                  }
                  className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="25000"
                  min="0"
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., Silver"
                  required
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Engine Size
                </label>
                <input
                  type="text"
                  value={formData.engineSize}
                  onChange={(e) =>
                    handleInputChange("engineSize", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  placeholder="e.g., 2.0L"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary}`}
                >
                  Description
                </label>
                <motion.button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={
                    isGenerating || !formData.brand || !formData.modelName
                  }
                  className={`${getColorClasses.button.secondary} text-sm px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Generate AI Description</span>
                    </div>
                  )}
                </motion.button>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[120px]`}
                placeholder="Enter vehicle description or use AI generation..."
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
              >
                Vehicle Images (Max 10)
              </label>
              <div
                className={`border-2 border-dashed ${getColorClasses.border.default} rounded-xl p-8 text-center`}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files)
                  }
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <svg
                    className={`w-12 h-12 ${getColorClasses.text.secondary} mx-auto mb-4`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className={`${getColorClasses.text.secondary} mb-2`}>
                    Click to upload images
                  </p>
                  <p className={`text-sm ${getColorClasses.text.muted}`}>
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </label>
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className={`text-sm ${getColorClasses.text.primary}`}>
                      {formData.images.length} image(s) selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image Preview Grid */}
            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-4`}
                >
                  Image Previews
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`relative group ${getColorClasses.background.card} rounded-lg overflow-hidden border ${getColorClasses.border.default}`}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreviews((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className={`absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity`}
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <motion.button
                type="button"
                className={`${getColorClasses.button.secondary} font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={`${getColorClasses.button.primary} font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Vehicle
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default AddNewVehicle;
