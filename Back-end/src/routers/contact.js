const express = require("express");
const { create, getOne, getAll, deleteOne } = require("../controllers/contact");
const { protect } = require("../middlewares/auth");
const router = express.Router();

router.post("/", create);
router.get("/:id", protect, getOne);
router.get("/", protect, getAll);
router.delete("/:id", protect, deleteOne);

module.exports = router;
