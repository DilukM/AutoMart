import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "../../../shared/components/AdminLayout";
import { getColorClasses } from "../../../shared/styles/colors";
import type { VehicleType } from "../../../shared/types/common";
import { vehicleService } from "../../../shared/services/vehicleService";
import { toast } from "react-toastify";

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

const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const loadVehicle = async () => {
    try {
      const vehicle = await vehicleService.getVehicleById(id!);
      setFormData({
        type: vehicle.type,
        brand: vehicle.brand,
        modelName: vehicle.modelName,
        color: vehicle.color,
        engineSize: vehicle.engineSize,
        year: vehicle.year,
        price: vehicle.price,
        images: [], // New images will be added here
        description: vehicle.description,
      });
      setExistingImages(vehicle.images || []);
    } catch (error) {
      console.error("Failed to load vehicle:", error);
      toast.error("Failed to load vehicle data");
      navigate("/admin/vehicles");
    } finally {
      setLoading(false);
    }
  };

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

    setNewImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setImagesToRemove((prev) => [...prev, imageUrl]);
  };

  const handleRestoreImage = (imageUrl: string) => {
    setImagesToRemove((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set([...prev, imageUrl]));
  };

  const handleImageLoad = () => {
    // Image loaded successfully
  };

  const generateAIDescription = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI description generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const aiDescription = `This ${formData.year} ${formData.brand} ${
        formData.modelName
      } is a premium ${formData.type.toLowerCase()} that combines style, performance, and reliability. This ${formData.color.toLowerCase()} vehicle features a ${
        formData.engineSize
      } engine. Perfect for those seeking quality and dependability in their next vehicle.`;

      setFormData((prev) => ({ ...prev, description: aiDescription }));
    } catch (error) {
      console.error("Failed to generate description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updateData = {
        id: id!,
        type: formData.type,
        brand: formData.brand,
        modelName: formData.modelName,
        color: formData.color,
        engineSize: formData.engineSize,
        year: formData.year,
        price: formData.price,
        description: formData.description,
        imagesToRemove: imagesToRemove,
      };

      // Only include images if new ones were uploaded
      if (formData.images.length > 0) {
        const formDataToSend = new FormData();
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formDataToSend.append(key, value.toString());
          }
        });
        formData.images.forEach((image) => {
          formDataToSend.append("images", image);
        });

        await vehicleService.updateVehicle(formDataToSend as any);
      } else {
        await vehicleService.updateVehicle(updateData);
      }

      toast.success("Vehicle updated successfully!");
      navigate(`/admin/vehicles/${id}`);
    } catch (error: any) {
      console.error("Failed to update vehicle:", error);
      if (error.response) {
        console.error("Backend error response:", error.response.data);
      }
      toast.error("Failed to update vehicle. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
            Edit Vehicle
          </motion.h1>
          <p className={`${getColorClasses.text.secondary} text-lg`}>
            Update vehicle information and add new images
          </p>
        </motion.div>

        {/* Vehicle Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-8 ${getColorClasses.border.default} border`}
        >
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

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                >
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {existingImages.map((image, index) => {
                    const isMarkedForRemoval = imagesToRemove.includes(image);
                    const hasError = imageErrors.has(image);
                    return (
                      <div key={index} className="relative group">
                        {hasError ? (
                          <div
                            className={`w-full h-24 rounded-lg border-2 flex items-center justify-center ${
                              isMarkedForRemoval
                                ? "border-red-500 opacity-50 bg-red-50 dark:bg-red-900/20"
                                : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 mx-auto mb-1 text-gray-400"
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
                              <p className="text-xs text-gray-500">
                                Failed to load
                              </p>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={image}
                            alt={`Current image ${index + 1}`}
                            className={`w-full h-24 object-cover rounded-lg border-2 bg-gray-100 dark:bg-gray-800 ${
                              isMarkedForRemoval
                                ? "border-red-500 opacity-50"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                            onError={() => handleImageError(image)}
                            onLoad={() => handleImageLoad()}
                            crossOrigin="anonymous"
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                          {isMarkedForRemoval ? (
                            <button
                              type="button"
                              onClick={() => handleRestoreImage(image)}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(image)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {isMarkedForRemoval && (
                          <div className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            ×
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mb-4">
                  <p className={`text-sm ${getColorClasses.text.secondary}`}>
                    Click "Remove" to mark images for deletion. You can add new
                    images below.
                  </p>
                  {imagesToRemove.length > 0 && (
                    <p
                      className={`text-sm text-red-600 dark:text-red-400 mt-1`}
                    >
                      {imagesToRemove.length} image(s) marked for removal
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label
                className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
              >
                Add New Images (Optional)
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
                    Click to upload new images
                  </p>
                  <p className={`text-sm ${getColorClasses.text.muted}`}>
                    PNG, JPG, GIF up to 10MB each (existing images will be kept)
                  </p>
                </label>
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className={`text-sm ${getColorClasses.text.primary}`}>
                      {formData.images.length} new image(s) selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* New Image Preview Grid */}
            {newImagePreviews.length > 0 && (
              <div className="mt-6">
                <label
                  className={`block text-sm font-medium ${getColorClasses.text.primary} mb-4`}
                >
                  New Image Previews
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`relative group ${getColorClasses.background.card} rounded-lg overflow-hidden border ${getColorClasses.border.default}`}
                    >
                      <img
                        src={preview}
                        alt={`New preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setNewImagePreviews((prev) =>
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
                onClick={() => navigate(`/admin/vehicles/${id}`)}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSaving}
                className={`${getColorClasses.button.primary} font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Vehicle"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default EditVehicle;
