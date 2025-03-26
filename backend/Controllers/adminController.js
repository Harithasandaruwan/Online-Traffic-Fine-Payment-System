import Admin from "../Models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Admin Registration
export const registerAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, nic, mobile } = req.body;

  try {
    // Check if email, nic, or mobile already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ email }, { nic }, { mobile }]
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with provided email, NIC, or mobile already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      nic,
      mobile,
    });

    await admin.save();

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.status(200).json(admins);
  } catch (error) {
    console.error("Fetch Admins Error:", error);
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, email, nic, mobile, password } = req.body;

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.nic = nic || admin.nic;
    admin.mobile = mobile || admin.mobile;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await admin.save();
    res.status(200).json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      nic: updatedAdmin.nic,
      mobile: updatedAdmin.mobile
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ message: "Error updating admin", error: error.message });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.deleteOne();
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
};
