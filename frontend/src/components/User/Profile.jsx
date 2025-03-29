import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../User Tools/authStore";
import { calculateGenderAndDOB } from "../User Tools/NicCalculator";
import Prediction from "../User Tools/Profile-tool/Prediction"; // Import Prediction component
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { logout, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { deleteAccount } = useAuthStore(); //not working

  //Nic calculate
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
    navigate("/login"); // Redirect to login page after logout
  };

  //not working
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount(); // Ensure this function makes an API request
        alert("Account deleted successfully.");
        navigate("/signup");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Error deleting account. Please try again.");
      }
    }
  };  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Profile Section */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md text-center">

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
            className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500"
          />

          <h5 className="text-xl font-bold mt-4">
            {user.firstName} {user.lastName}
          </h5>
          <p className="text-gray-600">Sri Lanka</p>
          <hr className="my-4" />
          <p>
            <strong>Risk Score:</strong> 62 / 100
          </p>
          <p>
            <strong>Total Violations:</strong> 12
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mt-4">
            View Details
          </button>
        </div>

        {/* Right Content Section */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold">Profile Dashboard</h2>
          <p className="text-black">
            Your driving insights and account details.
          </p>

          <div className="flex mt-4 border-b">
            {["profile", "prediction", "settings"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === "profile" && (
              <div>
                <h5 className="text-lg font-bold">Profile Details</h5>
                <table className="w-full mt-2 border-collapse border border-black">
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
                      <tr key={index} className="border-b border-black">
                        <th className="p-2 text-left font-semibold border border-black">
                          {label}
                        </th>
                        <td className="p-2 border border-black">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Link to="/update">
                  <button className="bg-[#8F87F1] text-white px-4 py-2 rounded-lg w-full mt-4 transition-transform transform hover:scale-105">
                    Edit Details
                  </button>
                </Link>
              </div>
            )}

            {activeTab === "prediction" && <Prediction />}

            {activeTab === "settings" && (
              <div>
                <h5 className="text-lg font-bold">Settings</h5>
                <p>Manage your account settings here.</p>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg w-full my-2"
                >
                  {isLoading ? "Logging Out..." : "Logout"}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
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
