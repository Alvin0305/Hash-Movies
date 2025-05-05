const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

exports.registerUser = async (req, res) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({ error: "email already exists" });

    existingUser = await User.findOne({ username: req.body.username });
    if (existingUser)
      return res.status(400).json({ error: "username already exists" });

    const user = new User(req.body);
    await user.save();
    const newUser = await User.findOne({ email: req.body.email });
    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    let user = await User.findOne({ username: usernameOrEmail });
    if (!user) {
      user = await User.findOne({ email: usernameOrEmail });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid email or username" });
    }
    if (!(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "Invalid password for the given email/username" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("looking for user with id:", id);
    const user = await User.findById(id)
      .populate("viewed")
      .populate("liked")
      .populate("watchList")
      .populate("interestedGenres");
    console.log("user got: ", user);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWatchList = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("watchList");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.watchList);
    console.log("watchlist: ", user.watchList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(204).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
