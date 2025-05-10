const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path"); // Added for path manipulation
const routes = require("./routes");

// Load environment variables from backend/.env specifically for local development
// On Render, these will be set in the dashboard.
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173', // Default Vite dev server port
  'http://localhost:3000', // Common CRA dev server port (just in case)
  'https://hash-movies.onrender.com'
  // You can add your Render URL here later if needed for any specific cross-origin scenario
  // e.g., 'https://your-app-name.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) OR from allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // If you plan to use cookies or authorization headers
};
app.use(cors(corsOptions));

// --- Middlewares ---
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// --- Static Assets (Uploads from backend) ---
// Serves files from HashMovies/backend/uploads/ at the /uploads URL path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api", routes); // All your API routes will be prefixed with /api

// --- Serve Frontend Static Files ---
// This must come AFTER API routes.
// It serves files from HashMovies/dist/
const frontendBuildPath = path.join(__dirname, "..", "dist");
app.use(express.static(frontendBuildPath));

// --- Catch-all for Client-Side Routing ---
// For any request that doesn't match one above (API, static files),
// send back the main index.html file from the frontend build.
app.get("*", (req, res) => {
  const indexPath = path.join(frontendBuildPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html is not found, it could mean the frontend hasn't been built
      // or the path is incorrect.
      console.error("Error sending index.html:", err);
      res.status(500).send("Error serving frontend application. Ensure it has been built.");
    }
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000; // Render will set process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});