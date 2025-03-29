import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../User Tools/authStore";
import { calculateGenderAndDOB } from "../User Tools/NicCalculator";
import Prediction from "../User Tools/Profile-tool/Prediction";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { logout, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { deleteAccount } = useAuthStore();

  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/check-auth",
          {
            withCredentials: true,
          }
        );

        const userData = response.data.user;
        setUser(userData);

        if (userData.NICNumber) {
          const { gender, dob } = calculateGenderAndDOB(userData.NICNumber);
          setGender(gender);
          setDob(dob);
        }
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount();
        alert("Account deleted successfully.");
        navigate("/signup");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error deleting account. Please try again.");
      }
    }
  };  

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="profile-layout">
        {/* Profile Card */}
        <div className="profile-card">
          <img
            src={
              user.profilePicture
                ? `http://localhost:3000${user.profilePicture}`
                : `/Profile_picture/${
                    gender === "Male"
                      ? "male-default.png"
                      : "female-default.png"
                  }`
            }
            alt="User"
            className="profile-image"
          />

          <h5 className="profile-name">
            {user.firstName} {user.lastName}
          </h5>
          <p className="profile-location">Sri Lanka</p>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">62</div>
              <div className="stat-label">Risk Score</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Total Violations</div>
            </div>
          </div>

          <button className="btn btn-primary">View Details</button>
        </div>

        {/* Content Section */}
        <div className="content-section">
          <h2 className="section-title">Profile Dashboard</h2>
          <p>Your driving insights and account details.</p>

          <div className="tabs">
            {["profile", "prediction", "settings"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "profile" && (
              <div>
                <h5 className="section-title">Profile Details</h5>
                <table className="profile-table">
                  <tbody>
                    {[
                      ["First Name", user.firstName],
                      ["Last Name", user.lastName],
                      ["Email", user.email],
                      ["Phone", user.phoneNumber],
                      ["NIC Number", user.NICNumber],
                      ["Gender", gender || "Not Calculated"],
                      ["Date of Birth", dob || "Not Calculated"],
                    ].map(([label, value], index) => (
                      <tr key={index}>
                        <th>{label}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link to="/update">
                  <button className="btn btn-primary">Edit Details</button>
                </Link>
              </div>
            )}

            {activeTab === "prediction" && <Prediction />}

            {activeTab === "settings" && (
              <div>
                <h5 className="section-title">Settings</h5>
                <p>Manage your account settings here.</p>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="btn btn-primary"
                >
                  {isLoading ? "Logging Out..." : "Logout"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
