const express = require("express");
const authRouter = require("./auth");
const propertyRouter = require("./property");
const propertyBookingRouter = require("./propertyBooking");
const payingGuestRouter = require("./payingGuest");
const payingGuestBookingRouter = require("./payingGuestBooking");
const serviceRouter = require("./service");
const serviceBookingRouter = require("./serviceBooking");
const contactRouter = require("./contact");
const chatRouter = require("./chat");

const router = express.Router();

router.use("/user", authRouter);
router.use("/property", propertyRouter);
router.use("/propertybooking", propertyBookingRouter);
router.use("/payingguest", payingGuestRouter);
router.use("/payingguestbooking", payingGuestBookingRouter);
router.use("/service", serviceRouter);
router.use("/servicebooking", serviceBookingRouter);
router.use("/contact", contactRouter);
router.use("/chat", chatRouter);
module.exports = router;
