import Fine from "../Models/FineReceipt.model.js";

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
  