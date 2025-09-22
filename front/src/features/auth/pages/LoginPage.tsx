import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/AuthContext";
import { type LoginRequest } from "../../../shared/types/common";
import { getColorClasses } from "../../../shared/styles/colors";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(credentials);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      console.error("LoginPage handleSubmit - login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${getColorClasses.background.main} flex items-center justify-center p-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-4 right-4"
      >
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`max-w-md w-full ${getColorClasses.background.card} rounded-2xl shadow-2xl p-8 space-y-8`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h2
            className={`text-4xl font-bold ${getColorClasses.gradients.primaryText} mb-2`}
          >
            Welcome Back
          </h2>
          <p className={getColorClasses.text.secondary}>
            Sign in to access your dashboard
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label
                htmlFor="username"
                className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`w-full px-4 py-3 ${getColorClasses.border.default} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getColorClasses.background.card} ${getColorClasses.text.primary} transition-all duration-200`}
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${getColorClasses.text.primary} mb-2`}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`w-full px-4 py-3 ${getColorClasses.border.default} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getColorClasses.background.card} ${getColorClasses.text.primary} transition-all duration-200`}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${getColorClasses.status.error} text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg`}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full ${getColorClasses.button.primary} font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              "Sign In"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
