import Fine from "../Models/FineReceipt.model.js";

//Upload a new fine image.
export const uploadFineImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      // Extract additional required fields from req.body
      const { vehicleNumber, licenseNumber, issueDate, section } = req.body;
  
      // Validate that all required fields are present
      if (!vehicleNumber || !licenseNumber || !issueDate || !section) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Save fileUrl instead of image
      const fine = await Fine.create({ 
        vehicleNumber,
        licenseNumber,
        issueDate,
        section,
        fileUrl: req.file.filename
      });
  
      res.status(201).json({ 
        message: "File uploaded", 
        filename: req.file.filename,
        fine
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  };
  
  //Get all fine details.
  export const getAllFineDetails = async (req, res) => {
    try {
      const fines = await Fine.find({});
      res.status(200).json(fines);
    } catch (error) {
      console.error("Error fetching fine details:", error);
      res.status(500).json({ error: "Failed to fetch fine details" });
    }
  };