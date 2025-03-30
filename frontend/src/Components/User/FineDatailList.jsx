import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const FineDetailList = () => {
  const [fineDetails, setFineDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const tableRef = useRef();

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

  const generatePDF = () => {
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("FineDetails.pdf");
    });
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Fine Details
      </h2>
      <button
        onClick={generatePDF}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition relative z-100"
      >
        Download PDF
      </button>
      <div className="overflow-x-auto relative" ref={tableRef}>
        <table className="w-full border-collapse border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">Vehicle Number</th>
              <th className="border border-gray-300 px-4 py-2">License Number</th>
              <th className="border border-gray-300 px-4 py-2">Issue Date</th>
              <th className="border border-gray-300 px-4 py-2">Section</th>
              <th className="border border-gray-300 px-4 py-2">File</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
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
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                      fine.status === "Pending"
                        ? "bg-yellow-500"
                        : fine.status === "Approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {fine.status}
                  </span>
                  {fine.status === "Approved" && (
                    <button
                      onClick={() => navigate("/fine-user")}
                      className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Go to Fine Only
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FineDetailList;