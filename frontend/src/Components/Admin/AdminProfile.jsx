import { motion } from "framer-motion";
import { useAuthStore } from "../User Tools/authStore";
import { LogOut } from "lucide-react";
import AdminManagement from "./AdminManagement";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./AdminProfile.css"

const AdminProfile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }; 

  return (
    <>
    < Navbar />
    <div className="min-h-screen bg-gray-900 relative z-50  admin-profile-container">
      <div className="container mx-auto px-4 py-8 relative z-50">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8 relative z-50">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
            <p className="text-gray-400">Welcome back, {user?.firstName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-50"
        >
          <AdminManagement />
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default AdminProfile;