const User = require("../Models/UserSchema");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email }).exec();
  if (foundUser) {
    return res.status(401).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword });
  user.role = "user";
  await user.save();

  res.json({
    email: user.email,
    name: user.name,
    role: user.role,
    id: user._id
  });
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "User does not exist" });
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Wrong Password" });

  const accessToken = jwt.sign(
    { UserInfo: { id: foundUser._id, role: foundUser.role } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { UserInfo: { id: foundUser._id, role: foundUser.role } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Set access token in cookie as well
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.json({
    user: {
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    }
  });
};

// Refresh token
exports.refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    const foundUser = await User.findById(decoded.UserInfo.id).exec();
    if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

    const accessToken = jwt.sign(
      { UserInfo: { id: foundUser._id, role: foundUser.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    res.json({ accessToken });
  });
};

// Logout user
exports.logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/'
  };
  res.clearCookie('jwt', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
  res.status(200).json({ message: 'Logged out successfully' });
};
