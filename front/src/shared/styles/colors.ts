// Simplified color configuration for the website
// Theme toggle removed - using light theme only

export const colors = {
  // Primary brand colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Secondary/accent colors
  secondary: {
    50: "#f4feffff",
    100: "#e8fdffff",
    200: "#d0fcfeff",
    300: "#abfcf9ff",
    400: "#79f7f9ff",
    500: "#46efdeff",
    600: "#26d3c4ff",
    700: "#1cafaaff",
    800: "#198f87ff",
    900: "#1a7570ff",
  },

  // Background colors (light theme only)
  background: {
    main: "#f9fafb",
    card: "#ffffff",
  },

  // Text colors (light theme only)
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    muted: "#9ca3af",
  },

  // Border colors (light theme only)
  border: "#e5e7eb",

  // Status colors (light theme only)
  status: {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },

  // Gradient colors (used for buttons, headings, etc.)
  gradients: {
    primary: {
      from: "#3b82f6", // blue-500
      to: "#5cf6eeff", // teal-500
    },
    secondary: {
      from: "#06b6d4", // cyan-500
      to: "#3b82f6", // blue-500
    },
    accent: {
      from: "#f59e0b", // amber-500
      to: "#ef4444", // red-500
    },
  },
};

// Utility function to get Tailwind classes (light theme only)
export const getColorClasses = {
  // Background classes
  background: {
    main: "bg-gray-50",
    card: "bg-white",
    glass: "bg-white/80",
  },

  // Text classes
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
  },

  // Border classes
  border: {
    default: "border-gray-200",
    light: "border-gray-100",
  },

  // Button classes
  button: {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-400 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    outline:
      "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
  },

  // Status classes
  status: {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  },

  // Gradient classes
  gradients: {
    primary: "bg-gradient-to-r from-blue-500 to-blue-400",
    primaryText:
      "bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent",
    secondary: "bg-gradient-to-r from-cyan-500 to-blue-500",
    accent: "bg-gradient-to-r from-amber-500 to-red-500",
  },
};
