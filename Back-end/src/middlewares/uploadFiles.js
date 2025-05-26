const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dnwbglnfu",
  api_key: "946762674983551",
  api_secret: "aLRtQ8kGWV4Sev7lEPEv6YFAkZY",
});

const upload = () => {
  // Create Cloudinary storage engine
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "emakaan",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only ${allowedTypes.join(", ")} are allowed for ${file.fieldname}`
        )
      );
    }
  };

  return multer({ storage, fileFilter });
};

const addFilesPathToBody = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  if (req.files.images) {
    req.body.images = req.files.images.map((file) => file.path);
  }

  if (req.files.contractPaper) {
    req.body.contractPaper = req.files.contractPaper[0].path;
  }

  if (req.files.profileImage) {
    req.body.image = req.files.profileImage[0].path;
  }

  if (req.files.cnicImage) {
    req.body.cnicImage = req.files.cnicImage.map((file) => file.path);
  }

  next();
};

module.exports = { upload, addFilesPathToBody };
