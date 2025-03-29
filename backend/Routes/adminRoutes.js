import express from "express";
import { registerAdmin, loginAdmin, getAllAdmins, updateAdmin, deleteAdmin, getAdminProfile, getAllUsers, getAllFines } from "../Controllers/adminController.js";
import { check } from "express-validator";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Debug middleware to log each request to admin routes
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [ADMIN ROUTES] ${req.method} ${req.originalUrl}`);
  next();
});

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("nic", "Invalid NIC format").matches(/^([0-9]{9}[vVxX]|[0-9]{12})$/),
    check("mobile", "Invalid mobile number").matches(/^[0-9]{10}$/),
  ],
  registerAdmin
);

router.post("/login", loginAdmin);
router.get("/", protectAdmin, getAllAdmins);
router.put("/:id", protectAdmin, updateAdmin);
router.delete("/:id", protectAdmin, deleteAdmin);

router.get("/profile", protectAdmin, getAdminProfile);
router.get("/users", protectAdmin, getAllUsers);
router.get("/fines", protectAdmin, getAllFines);

router.put("/fines/:id", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const fine = await FineReceipt.findById(req.params.id);
    if (!fine) return res.status(404).json({ message: "Fine not found" });

    fine.status = status;
    await fine.save();
    res.json({ message: "Fine status updated", fine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
