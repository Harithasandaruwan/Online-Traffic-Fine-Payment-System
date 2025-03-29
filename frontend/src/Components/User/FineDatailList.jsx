import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FineDetailList = () => {
  const [fineDetails, setFineDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/fine/all")
      .then((res) => {
        setFineDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching fine details:", err);
        setError("Failed to fetch fine details.");
        setLoading(false);
      });
  }, []);

  const handleViewClick = (fineId) => {
    navigate(`/viewFineDetail/${fineId}`);
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Fine Details
      </h2>
      {fineDetails.length === 0 ? (
        <p className="text-center text-gray-500">No fine details available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border border-gray-300 px-4 py-2">Vehicle Number</th>
                <th className="border border-gray-300 px-4 py-2">License Number</th>
                <th className="border border-gray-300 px-4 py-2">Issue Date</th>
                <th className="border border-gray-300 px-4 py-2">Section</th>
                <th className="border border-gray-300 px-4 py-2">File</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {fineDetails.map((fine) => (
                <tr key={fine._id} className="hover:bg-gray-100 transition">
                  <td className="border border-gray-300 px-4 py-2 text-center">{fine.vehicleNumber}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{fine.licenseNumber}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(fine.issueDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{fine.section}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {fine.fileUrl ? (
                      fine.fileUrl.endsWith(".png") ||
                      fine.fileUrl.endsWith(".jpg") ||
                      fine.fileUrl.endsWith(".jpeg") ? (
                        <img
                          src={`http://localhost:3000/fine-images/${fine.fileUrl}`}
                          alt="Fine Receipt"
                          className="w-20 h-auto mx-auto rounded-md shadow-md"
                        />
                      ) : (
                        <a
                          href={`http://localhost:3000/fine-images/${fine.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View File
                        </a>
                      )
                    ) : (
                      <span className="text-gray-400">No File</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleViewClick(fine._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FineDetailList;