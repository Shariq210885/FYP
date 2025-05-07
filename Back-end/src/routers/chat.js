const express = require("express");
const {
  create,
  getOne,
  getAll,
  myChatwithOthers,
  updateOne,
  deleteOne,
} = require("../controllers/chat");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.post("/", protect, create);
router.get("/:id", protect, getOne);
router.get("/", protect, getAll);
router.patch("/:id", protect, updateOne);
router.get("/my/chats/:userid", protect, myChatwithOthers);
router.delete("/:id", protect, deleteOne);

module.exports = router;
