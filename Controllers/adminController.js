const AdminSchema = require("../Models/AdminSchema");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Register admin
exports.registerAdmin = async (req, res) => {
  const { name, email, pass } = req.body;
  if (!name || !email || !pass) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await AdminSchema.findOne({ email }).exec();
  if (foundUser) {
    return res.status(401).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(pass, 10);
  const user = new AdminSchema({ name, email, pass: hashedPassword });
  await user.save();

  const accessTokenAdmin = jwt.sign(
    { UserInfo: { id: user._id } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    { UserInfo: { id: user._id } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    accessToken: accessTokenAdmin,
    email: user.email,
    name: user.name,
  });
};

// Login admin
exports.loginAdmin = async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await AdminSchema.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "User does not exist" });
  }
  const match = await bcrypt.compare(pass, foundUser.pass);
  if (!match) return res.status(401).json({ message: "Wrong Password" });

  const accessTokenAdmin = jwt.sign(
    { UserInfo: { id: foundUser._id } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "60m" }
  );
  const refreshToken = jwt.sign(
    { UserInfo: { id: foundUser._id } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({
    accessToken: accessTokenAdmin,
    email: foundUser.email,
    name: foundUser.name,
  });
};

// Delete all data from all collections (admin only)
exports.clearDatabase = async (req, res) => {
  try {
    // Import models locally to avoid circular dependencies
    const Admin = require('../Models/AdminSchema');
    const User = require('../Models/UserSchema');
    const Hotel = require('../Models/hotelSchema');
    const Contact = require('../Models/ContactSchema');
    const Booking = require('../Models/BookingSchema');
    const Checkout = require('../Models/CheckoutShema');
    const Room = require('../Models/hotelSchema'); // Assuming rooms stored in hotelSchema

    await Promise.all([
      Admin.deleteMany({}),
      User.deleteMany({}),
      Hotel.deleteMany({}),
      Contact.deleteMany({}),
      Booking.deleteMany({}),
      Checkout.deleteMany({}),
      Room.deleteMany({}),
    ]);

    res.json({ message: 'All data cleared successfully.' });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ message: 'Failed to clear database.', error: error.message });
  }
};


