const express = require("express");
const {
  upload,
  addFilesPathToBody,
} = require("./../middlewares/UploadServiceFiles");
const {
  create,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  search,
  myService,
  postReview,
} = require("../controllers/service");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// User-specific routes
router.get("/myservices", protect, myService); 

// CRUD routes
router.post(
  "/",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "subServices[]", maxCount: 10 },
  ]),
  addFilesPathToBody,
  create
);
router.patch(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "subServices[]", maxCount: 10 },
  ]),
  addFilesPathToBody,
  updateOne
);
router.delete("/:id", deleteOne);

// Read-only routes
router.get("/:id", getOne);
router.get("/", getAll);

// Search functionality
router.get("/servicesearch/search", search);
router.post("/post/:id",protect,postReview)

module.exports = router;
