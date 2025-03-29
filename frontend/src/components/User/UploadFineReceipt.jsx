import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UploadCloud, AlertCircle } from "lucide-react";
import sectionsData from "../User Tools/sectionsData";
import axios from "axios";

const UploadFineReceipt = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [section, setSection] = useState("");
  const [file, setFile] = useState();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  // const handleFileChange = (e) => {
  //   const formdata = new FormData();
  //   formdata.append('file', file);
  //   axios.post('http://localhost:3000/upload', formdata)
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))
  // };

  // const submitFineProof = () => {
  //   if (!vehicleNumber || !licenseNumber || !section || !issueDate || !file) {
  //     setMessage("Please fill all the required fields and upload the fine receipt.");
  //     setMessageType("error");
  //     return;
  //   }

  //   setMessage(""); // Clear any previous error messages
  //   navigate("/payment");
  // };

  const handleUpload = () => {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('vehicleNumber', vehicleNumber);
    formdata.append('licenseNumber', licenseNumber);
    formdata.append('issueDate', issueDate);
    formdata.append('section', section);
  
    axios
      .post('http://localhost:3000/api/fine/upload', formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        // Check if backend confirms data storage successfully
        if (res.status === 201) {
          setMessage("File uploaded successfully!");
          setMessageType("success");
          // Optionally delay navigation to allow user to see the message
          setTimeout(() => {
            navigate("/fine-data-list");
          }, 2000); // 2-second delay before navigating
        } else {
          setMessage("Unexpected response from the server.");
          setMessageType("error");
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage("File upload failed.");
        setMessageType("error");
      });
  };
  

  return (
    <div className="relative">
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-[#C68EFD] hover:underline">← Back to Home</Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-auto mt-12"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 via-[#C68EFD] to-emerald-500 text-transparent bg-clip-text">
            Upload Fine Receipt
          </h2>
          <p className="text-gray-300 text-center">Submit your fine proof for admin approval</p>

          <div className="mt-6">
            <label className="font-semibold block mb-1 text-gray-300">Vehicle Number:</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
              placeholder="ABC-1234 / WP-AB-1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
            />
          </div>

          <div className="mt-4">
            <label className="font-semibold block mb-1 text-gray-300">License Number:</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
              placeholder="L123456789"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
            />
          </div>

          <div className="mt-4">
            <label className="font-semibold block mb-1 text-gray-300">Issue Date:</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#C68EFD]"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>

          <div className="relative mt-4">
            <label className="font-semibold block mb-1 text-gray-300">Section:</label>
            <select
              className="w-full p-3 border border-gray-600 rounded-md bg-gradient-to-r from-[#B07CE5] to-[#C68EFD] text-white 
              focus:outline-none focus:ring-2 focus:ring-[#C68EFD] appearance-none cursor-pointer transition-all duration-200 
              hover:bg-[#B07CE5] shadow-md"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="">Select a section</option>
              {Object.keys(sectionsData).map((sec) => (
                <option key={sec} value={sec}>Section {sec}</option>
              ))}
            </select>
          </div>

          {section && sectionsData[section] && (
            <div className="mt-2 p-3 bg-gray-700 rounded-md">
              <p className="text-white font-semibold">{sectionsData[section].provision}</p>
              <p className="text-green-400 font-semibold">Fine Amount: Rs. {sectionsData[section].fine}</p>
            </div>
          )}

          {/* Upload File Section */}
          <div className="mt-4">
            <label className="font-semibold block mb-1 text-gray-300">Upload Fine Receipt (.pdf, .png, .jpg | Max 2MB):</label>
            <div className="flex items-center space-x-3 p-3 border border-gray-600 rounded-md bg-gray-700 text-white cursor-pointer hover:bg-gray-600 transition">
              <UploadCloud className="w-6 h-6 text-[#C68EFD]" />
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg"
                onChange={e => setFile(e.target.files[0])}
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                {file ? file.name : "Choose a file"}
              </label>
            </div>
          </div>

          {message && (
            <p className={`mt-2 text-sm ${messageType === "error" ? "text-red-400" : "text-green-400"}`}>
              {messageType === "error" ? <AlertCircle className="inline-block mr-1" /> : null} {message}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            className="w-full mt-6 py-3 px-4 bg-[#C68EFD] text-white font-bold rounded-lg shadow-lg hover:bg-[#B07CE5] focus:outline-none focus:ring-2 focus:ring-[#C68EFD] transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
          >
            Submit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default UploadFineReceipt;
