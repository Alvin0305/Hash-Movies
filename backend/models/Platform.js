const mongoose = require("mongoose");

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: String,
  logo: String,
  supportedRegions: [{type: String}],
});

module.exports = mongoose.model("Platform", platformSchema);
