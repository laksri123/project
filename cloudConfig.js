const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// dotenv
if (process.env.NODE_ENV != "production") {
  //So that it does not run on production phase
  require("dotenv").config();
}

// SET Clodinary to store file
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// create storage where to store file
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    // format: "jpg", // even you give a pdf it will be converted to jpg
      allowedFormats: ["jpg","jpeg","png"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
