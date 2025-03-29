import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, UserCog, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../User Tools/authStore";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nic: "",
    mobile: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem("adminToken");

  // Fetch all admins
  const fetchAdmins = async () => {
    if (!token) {
      console.error("No token found");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/admin", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/admin/register", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormData({ name: "", email: "", password: "", nic: "", mobile: "" });
      fetchAdmins();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin._id);
    setFormData({ name: admin.name, email: admin.email, nic: admin.nic, mobile: admin.mobile, password: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");

    try {
      setLoading(true);
      await axios.put(`http://localhost:3000/api/admin/${editingAdmin}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditingAdmin(null);
      setFormData({ name: "", email: "", password: "", nic: "", mobile: "" });
      fetchAdmins();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update admin");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!token) return navigate("/login");
  
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/api/admin/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        fetchAdmins();  // Refresh the list after successful deletion
        setError("");   // Clear any previous errors
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete admin");
      } finally {
        setLoading(false);
      }
    }
  };  

  const handleCancelEdit = () => {
    setEditingAdmin(null);
    setFormData({ name: "", email: "", password: "", nic: "", mobile: "" });
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-xl relative z-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserCog className="w-6 h-6 text-[#C68EFD]" />
          <h2 className="text-2xl font-bold text-white">Admin Management</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">{error}</div>}

      {/* Admins Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">NIC</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
            ) : filteredAdmins.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4">No admins found</td></tr>
            ) : (
              filteredAdmins.map(admin => (
                <tr key={admin._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-3">{admin.name}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.nic}</td>
                  <td className="px-4 py-3">{admin.mobile}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleEdit(admin)} className="p-1 text-blue-400 hover:text-blue-300">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(admin._id)} className="p-1 text-red-400 hover:text-red-300">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Admin Form */}
      <form onSubmit={editingAdmin ? handleUpdate : handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-50">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Full Name"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
          required
        />
        <input
          type="text"
          name="nic"
          value={formData.nic}
          onChange={handleInputChange}
          placeholder="NIC Number"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
          required
        />
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          placeholder="Mobile Number"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder={editingAdmin ? "New Password (optional)" : "Password"}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
          required={!editingAdmin}
        />
        <div className="md:col-span-2 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 bg-[#C68EFD] text-white rounded-lg hover:bg-[#B07CE5] transition-colors"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : (editingAdmin ? "Update Admin" : "Add Admin")}
          </motion.button>
          {editingAdmin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminManagement;
