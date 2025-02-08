const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload"); // Specify the folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique file name
  },
});

const upload = multer({ storage: storage });

const addFilesPathToBody = async (req, res, next) => {
  try {
    // Extract uploaded files
    const thumbnail = req.files["thumbnail"] ? req.files["thumbnail"][0] : null;
    const subserviceImages = req.files["subServices[]"];

    if (thumbnail) {
      req.body.thumbnail = `${req.protocol}://${req.get("host")}/${thumbnail.path}`;
    }

    // Parse subservices from req.body
    const subservices = JSON.parse(req.body.subServices || "[]");

    // Add image paths to subservices
    req.body.subServices = subservices.map((service, index) => {
      const subserviceImage =
        subserviceImages && subserviceImages[index]
          ? `${req.protocol}://${req.get("host")}/${subserviceImages[index].path}` 
          : subservices[index].thumbnail;
          
      return {
        ...service, // Retain other subservice fields (title, price)
        thumbnail: subserviceImage, // Add thumbnail path
      };
    });

    next();
  } catch (error) {
    console.error("Error processing subservices:", error);
    res.status(500).json({ message: "Error processing files", error });
  }
};

module.exports = {
  upload,
  addFilesPathToBody,
};
