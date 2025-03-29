import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './DB/connectDB.js';
import authRoutes from './Routes/auth.route.js';
import adminRoutes from './Routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] [GLOBAL] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS configuration to allow requests from your frontend origins
app.use(cors({
  origin: "http://localhost:5176",  // Change to match your frontend
  credentials: true, // Allow cookies & authentication headers
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes mounting
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Connect to MongoDB and start the server
connectDB().then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
