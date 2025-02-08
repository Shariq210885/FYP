const express = require("express");
const {
  create,
  updateRecordInDB,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  myAssignedServiceBookings,
} = require("../controllers/serviceBooking");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/", create);
router.get("/success", updateRecordInDB);
router.patch("/:id", protect, updateOne);
router.get("/my/services", protect, myAssignedServiceBookings);
router.get("/:id", getOne);
router.get("/", getAll);
router.delete("/:id", protect, deleteOne);

module.exports = router;
