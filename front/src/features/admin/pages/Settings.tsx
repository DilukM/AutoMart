import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AdminLayout from "../../../shared/components/AdminLayout";
import { getColorClasses } from "../../../shared/styles/colors";

interface SettingsData {
  general: {
    siteName: string;
    adminEmail: string;
    currency: string;
    timezone: string;
    language: string;
  };
  notifications: {
    emailNotifications: boolean;
    salesAlerts: boolean;
    lowInventoryAlerts: boolean;
    systemUpdates: boolean;
  };
  business: {
    dealershipName: string;
    address: string;
    phone: string;
    website: string;
    taxRate: number;
  };
  features: {
    aiDescriptionGeneration: boolean;
    autoPublish: boolean;
    priceNegotiation: boolean;
    multipleImages: boolean;
  };
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "notifications" | "business" | "features"
  >("general");
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      siteName: "AutoDealer Pro",
      adminEmail: "admin@autodealer.com",
      currency: "USD",
      timezone: "America/New_York",
      language: "English",
    },
    notifications: {
      emailNotifications: true,
      salesAlerts: true,
      lowInventoryAlerts: true,
      systemUpdates: false,
    },
    business: {
      dealershipName: "Premium Auto Sales",
      address: "123 Main Street, City, State 12345",
      phone: "(555) 123-4567",
      website: "https://premiumautosales.com",
      taxRate: 8.5,
    },
    features: {
      aiDescriptionGeneration: true,
      autoPublish: false,
      priceNegotiation: true,
      multipleImages: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = (
    section: keyof SettingsData,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "business", label: "Business Info", icon: "🏢" },
    { id: "features", label: "Features", icon: "✨" },
  ];

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
            Settings
          </motion.h1>
          <p className={`${getColorClasses.text.secondary} text-lg`}>
            Configure your vehicle management system preferences and settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-6 ${getColorClasses.border.default} border space-y-2`}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? `${getColorClasses.button.primary} shadow-lg`
                    : `${getColorClasses.background.card} hover:bg-gray-100 dark:hover:bg-gray-700 ${getColorClasses.text.primary}`
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`lg:col-span-3 ${getColorClasses.background.glass} backdrop-blur-lg rounded-2xl shadow-xl p-8 ${getColorClasses.border.default} border`}
          >
            {/* General Settings */}
            {activeTab === "general" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2
                  className={`text-2xl font-bold ${getColorClasses.text.primary} mb-6`}
                >
                  General Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) =>
                        updateSetting("general", "siteName", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={settings.general.adminEmail}
                      onChange={(e) =>
                        updateSetting("general", "adminEmail", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Currency
                    </label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) =>
                        updateSetting("general", "currency", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) =>
                        updateSetting("general", "timezone", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    >
                      <option value="America/New_York">
                        Eastern Time (ET)
                      </option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">
                        Pacific Time (PT)
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2
                  className={`text-2xl font-bold ${getColorClasses.text.primary} mb-6`}
                >
                  Notification Settings
                </h2>

                <div className="space-y-6">
                  {Object.entries(settings.notifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <h3
                            className={`font-medium ${getColorClasses.text.primary}`}
                          >
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </h3>
                          <p
                            className={`text-sm ${getColorClasses.text.secondary}`}
                          >
                            {key === "emailNotifications" &&
                              "Receive notifications via email"}
                            {key === "salesAlerts" &&
                              "Get notified when a vehicle is sold"}
                            {key === "lowInventoryAlerts" &&
                              "Alert when inventory is running low"}
                            {key === "systemUpdates" &&
                              "Notifications about system updates"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              updateSetting(
                                "notifications",
                                key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            )}

            {/* Business Settings */}
            {activeTab === "business" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2
                  className={`text-2xl font-bold ${getColorClasses.text.primary} mb-6`}
                >
                  Business Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Dealership Name
                    </label>
                    <input
                      type="text"
                      value={settings.business.dealershipName}
                      onChange={(e) =>
                        updateSetting(
                          "business",
                          "dealershipName",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Address
                    </label>
                    <textarea
                      value={settings.business.address}
                      onChange={(e) =>
                        updateSetting("business", "address", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[80px]`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.business.phone}
                      onChange={(e) =>
                        updateSetting("business", "phone", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.business.website}
                      onChange={(e) =>
                        updateSetting("business", "website", e.target.value)
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
                    >
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.business.taxRate}
                      onChange={(e) =>
                        updateSetting(
                          "business",
                          "taxRate",
                          parseFloat(e.target.value)
                        )
                      }
                      className={`w-full px-4 py-3 rounded-xl ${getColorClasses.background.card} ${getColorClasses.border.default} border ${getColorClasses.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feature Settings */}
            {activeTab === "features" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <h2
                  className={`text-2xl font-bold ${getColorClasses.text.primary} mb-6`}
                >
                  Feature Settings
                </h2>

                <div className="space-y-6">
                  {Object.entries(settings.features).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h3
                          className={`font-medium ${getColorClasses.text.primary}`}
                        >
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </h3>
                        <p
                          className={`text-sm ${getColorClasses.text.secondary}`}
                        >
                          {key === "aiDescriptionGeneration" &&
                            "Enable AI-powered vehicle description generation"}
                          {key === "autoPublish" &&
                            "Automatically publish new vehicles to listings"}
                          {key === "priceNegotiation" &&
                            "Allow price negotiation on listings"}
                          {key === "multipleImages" &&
                            "Support multiple images per vehicle"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            updateSetting("features", key, e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                className={`${getColorClasses.button.primary} font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Settings"
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default Settings;
