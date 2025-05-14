const express = require("express");
const {
  create,
  updateRecordInDB,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  getBookingsByLandOwner,
  getMyBookings,
} = require("../controllers/propertyBooking");
const { protect } = require("../middlewares/auth");
const { upload, addFilesPathToBody } = require("../middlewares/uploadFiles");

const router = express.Router();

router.post(
  "/",
  protect,
  upload().fields([{ name: "contractPaper", maxCount: 1 }]),

  addFilesPathToBody,
  create
);
router.get("/success", updateRecordInDB);
router.patch("/:id", protect, updateOne);
router.get("/:id", getOne);
router.get("/", getAll);
router.get("/my/propertybookings", protect, getBookingsByLandOwner);
router.delete("/:id", protect, deleteOne);
router.get("/my/getmybooking", protect, getMyBookings);

module.exports = router;
