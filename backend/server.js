// server.js

const express = require("express");
const cors = require('cors'); // <--- Import the cors package
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require("./routes");

dotenv.config();

const app = express();

// --- Database Connection (Example - ensure you have this) ---
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined.");
  process.exit(1);
}
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
// --- End Database Connection ---


// --- Middleware ---
app.use(cors()); // <--- USE the CORS middleware HERE

app.use(express.json()); // <--- Also ensure JSON middleware is present and BEFORE routes

// --- End Middleware ---


// --- Routes ---
// Make sure the base path has a leading slash
app.use("/api", routes); // <--- Mount API routes with leading slash
// --- End Routes ---


// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// --- End Server Startup ---