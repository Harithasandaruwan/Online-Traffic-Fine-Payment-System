import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./FineManagement.css";

const FineManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fines, setFines] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin/login");
      return;
    }
    fetchFines();
  }, [navigate]);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        navigate("/admin/login");
        return;
      }
  
      const response = await axios.get("http://localhost:3000/api/admin/fines", {  // Ensure full URL
        headers: { Authorization: `Bearer ${adminToken}` },
      });
  
      console.log("Fetched fines data:", response.data); 
      setFines(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching fines:", error.response?.data || error.message);
      setFines([]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredFines = fines.filter((fine) => {
    const matchesFilter =
      filter === "all" || fine.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      fine.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const updateFineStatus = async (fineId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/fines/${fineId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
      );
      console.log("Fine updated:", response.data);
    } catch (error) {
      console.error("Error updating fine status:", error);
    }
  };
  
  const handleStatusChange = async (fineId, newStatus) => {
    try {
      setFines(fines.map(fine => 
        fine._id === fineId ? { ...fine, status: newStatus } : fine
      ));
      await updateFineStatus(fineId, newStatus); // ✅ Now it's properly defined
      fetchFines();
    } catch (error) {
      console.error("Error updating fine status:", error);
    }
  };
  
  

  const handleGenerateReport = async (fineId) => {
    try {
      const reportData = {
        fineId: fineId,
        userName: fines.find(f => f._id === fineId)?.userName,
        vehicleNumber: fines.find(f => f._id === fineId)?.vehicleNumber,
        licenseNumber: fines.find(f => f._id === fineId)?.licenseNumber,
        issueDate: fines.find(f => f._id === fineId)?.issueDate,
        section: fines.find(f => f._id === fineId)?.section,
        status: "Approved",
        generatedDate: new Date().toISOString()
      };

      const reportString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([reportString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fine_report_${fineId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("Report downloaded successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    }
  };

  if (loading) {
    return <div className="fine-management-loading">Loading...</div>;
  }

  return (
    <div className="fine-management">
      <Navbar />
      <div className="fine-management-content">
        <div className="fine-management-header top_layer">
          <div className="fine-management-filters">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="fine-management-filter"
            >
              <option value="all">All Fines</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Search by name, vehicle number or license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fine-management-search"
            />
          </div>
        </div>

        <div className="fine-management-table-container top_layer">
          <table className="fine-management-table">
            <thead>
              <tr>
                <th>Fine Image</th>
                <th>User Name</th>
                <th>Vehicle Number</th>
                <th>License Number</th>
                <th>Issue Date</th>
                <th>Section</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.length > 0 ? (
                filteredFines.map((fine) => (
                  <tr key={fine._id}>
                    <td>
                      <div className="fine-image-container">
                        <img 
                          src={fine.fileUrl} 
                          alt="Fine Image" 
                          className="fine-image"
                        />
                      </div>
                    </td>
                    <td>{fine.userName}</td>
                    <td>{fine.vehicleNumber}</td>
                    <td>{fine.licenseNumber}</td>
                    <td>{new Date(fine.issueDate).toLocaleDateString()}</td>
                    <td>{fine.section}</td>
                    <td>
                      <span
                        className={`fine-management-status ${fine.status.toLowerCase()}`}
                      >
                        {fine.status}
                      </span>
                    </td>
                    <td>
                      <div className="fine-management-actions">
                        {fine.status === "Pending" && (
                          <>
                            <button
                              className="fine-management-approve-btn"
                              onClick={() => handleStatusChange(fine._id, "Approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="fine-management-reject-btn"
                              onClick={() => handleStatusChange(fine._id, "Rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {fine.status === "Approved" && (
                          <button
                            className="fine-management-report-btn"
                            onClick={() => handleGenerateReport(fine._id)}
                          >
                            Download Report
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-fines">
                    No fines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FineManagement;
