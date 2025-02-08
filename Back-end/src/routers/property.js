const express = require("express");
const { upload, addFilesPathToBody } = require("../middlewares/uploadFiles");
const {
  create,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  myProperties,
  search,
  postReview
} = require("../controllers/property");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Public Routes
router.get("/", getAll); // Get all properties
router.get("/search", search); // Search properties
router.get("/:id", getOne); // Get a single property by ID

// Protected Routes
router.post(
  "/",
  protect,
  upload().fields([
    { name: "images", maxCount: 10 },
    { name: "contractPaper", maxCount: 1 },
  ]),
  
  addFilesPathToBody,
  create
); // Create a property

router.get("/my/properties", protect, myProperties); // Get user's properties

router.patch(
  "/:id",
  protect,
  upload().fields([
    { name: "images", maxCount: 10 },
    { name: "contractPaper", maxCount: 1 },
  ]),
  addFilesPathToBody,
  updateOne
); // Update a property by ID

router.delete("/:id", protect, deleteOne); // Delete a property by ID
router.post("/post/:propertyid",protect,postReview)
module.exports = router;

