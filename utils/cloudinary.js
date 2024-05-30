const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'dynprvsfg',
  api_key: "891988227679311",
  api_secret: "CveTsCuTYw4giY9iBYFwUy_NK4Y",
  secure: true,
});

module.exports = cloudinary;
