import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { getColorClasses } from "../styles/colors";
import { useAuth } from "../hooks/AuthContext";
import {
  HiOutlineViewGrid,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout
} from "react-icons/hi";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <HiOutlineViewGrid className="w-5 h-5" />,
    },
    {
      title: "Vehicle Management",
      path: "/admin/vehicles",
      icon: <HiOutlineTruck className="w-5 h-5" />,
    },
    {
      title: "User Management",
      path: "/admin/users",
      icon: <HiOutlineUsers className="w-5 h-5" />,
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <HiOutlineCog className="w-5 h-5" />,
    },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-70 ${
          getColorClasses.background.card
        } shadow-xl z-50 lg:sticky lg:top-0 lg:shadow-none ${
          getColorClasses.border.default
        } lg:border-r transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-6 ${getColorClasses.border.default} border-b`}>
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-xl font-bold ${getColorClasses.gradients.primaryText}`}
                >
                  Admin Panel
                </h2>
                <p className={`text-sm ${getColorClasses.text.secondary} mt-1`}>
                  Welcome, {user?.username}
                </p>
              </div>
              <button
                onClick={onToggle}
                className={`lg:hidden p-2 rounded-lg ${getColorClasses.text.secondary} hover:opacity-80 transition-colors`}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onToggle}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? `${getColorClasses.gradients.primary} text-white shadow-lg`
                      : `${getColorClasses.text.secondary} hover:${getColorClasses.background.glass} hover:${getColorClasses.text.primary}`
                  }`}
                >
                  <span
                    className={`${isActive ? "text-white" : "text-current"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 ${getColorClasses.border.default} border-t`}>
            <motion.button
              onClick={logout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${getColorClasses.button.secondary} hover:opacity-80 transition-all duration-200`}
            >
              <HiOutlineLogout className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>

            <div
              className={`mt-4 pt-4 ${getColorClasses.border.default} border-t text-center`}
            >
              <p className={`text-xs ${getColorClasses.text.muted}`}>
                Vehicle Sales Management
              </p>
              <p className={`text-xs ${getColorClasses.text.muted}`}>v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
