const express = require("express");
const {
  create,
  updateRecordInDB,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  getBookingsByLandOwner,
} = require("../controllers/payingGuestBooking");
const { protect } = require("../middlewares/auth");
const { upload, addFilesPathToBody } = require("../middlewares/uploadFiles");

const router = express.Router();

router.post("/", protect,
  upload().fields([
    { name: "contractPaper", maxCount: 1 },
  ]),
  
  addFilesPathToBody
  ,
  create);
router.get("/success", updateRecordInDB);
router.patch("/:id", protect, updateOne);
router.get("/:id", getOne);
router.get("/", getAll);
router.get("/my/payguestbookings",protect, getBookingsByLandOwner);

router.delete("/:id", protect, deleteOne);

module.exports = router;
