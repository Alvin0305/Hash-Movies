const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error(
    "FATAL ERROR: MONGODB_URI is not defined in environment variables."
  );
  process.exit(1);
}
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

console.log(
  "SERVER STARTING - MONGODB_URI from process.env:",
  process.env.MONGODB_URI
);
// --- CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://hash-movies.onrender.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Origin ${origin} not allowed.`); // Log for debugging
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static Assets (Uploads from backend) ---
// REMOVE THIS LINE as images are now served from Cloudinary:
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api", routes);

// --- Serve Frontend Static Files ---
const frontendBuildPath = path.join(__dirname, "..", "dist");
app.use(express.static(frontendBuildPath));

// --- Catch-all for Client-Side Routing ---
app.get("*", (req, res) => {
  const indexPath = path.join(frontendBuildPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(
        `Error sending SPA fallback index.html for path ${req.path}:`,
        err
      );
      res.status(500).send("Internal server error serving the application.");
    }
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
