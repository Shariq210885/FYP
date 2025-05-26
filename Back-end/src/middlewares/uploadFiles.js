const multer = require("multer");
const fs = require("fs");

const upload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = "upload";
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
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
  if (!req.files && req.files.length < 1) {
    next();
  }
  if (req.files.images) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    req.body.images = req.files.images.map(
      (file) => `${baseUrl}/${file.path.replace(/\\/g, "/")}`
    );
  }
  if (req.files.contractPaper) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    req.body.contractPaper = `${baseUrl}/${req.files.contractPaper[0].path.replace(
      /\\/g,
      "/"
    )}`;
  }
  if (req.files.profileImage) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    req.body.image = `${baseUrl}/${req.files.profileImage[0].path.replace(
      /\\/g,
      "/"
    )}`;
  }
  if (req.files.cnicImage) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    req.body.cnicImage = req.files.cnicImage.map(
      (file) => `${baseUrl}/${file.path.replace(/\\/g, "/")}`
    );
  }

  next();
};

module.exports = { upload, addFilesPathToBody };
