const PayingGuestBooking = require("../models/payingGuestBooking");
const PayingGuest = require("../models/payingGuest");
const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const AppError = require("../middlewares/AppError");
require("dotenv").config();
const sendEmail = require("../helper/Email");
const stripe = require("stripe")(process.env.STRIP_SK);

const create = catchAsync(async (req, res, next) => {
  const payingGuestBooking = await PayingGuestBooking.create(req.body);

  if (!payingGuestBooking) {
    return next(new AppError("Couldn't book property try later", 400));
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: `${payingGuestBooking.payingGuestId}`,
            description: "This is the payment amount for booked Paying Guest",
          },
          unit_amount: req.body.totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      payingGuestId: JSON.stringify(payingGuestBooking._id).split('"')[1],
    },
    mode: "payment",
    success_url:
      "https://fyp-3kn1.onrender.com/#/paingguestbooking/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://fyp-3kn1.onrender.com/#/",
  });

  const landownerId = await User.findById(req.body.landownerId).select("email");

  const emailObj = {
    resetURL: "",
    email: landownerId.email, // Access the email directly
    subject: `Paying Guest Booking`,
    text: "Paying Guest Booking Email",
    html: `<div style="padding:25px">
             <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
             <h2>Hi,</h2>
             <p>Somebody booked Paying Guest. Please check your dashboard for confirmation.</p>
           </div>`,
  };

  await sendEmail(emailObj);
  return res.status(200).json({ url: session.url });
});
const updateRecordInDB = catchAsync(async (req, res, next) => {
  try {
    const sessionId = req.query.session_id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session) {
      const update = {
        $set: {
          "paymentDetails.paymentMethod": "credit card",
          "paymentDetails.paymentStatus": "Completed",
          "paymentDetails.transactionId": session.payment_intent,
        },
      };

      payingGuestId = session.metadata.payingGuestId;

      const UpdatePayingGuest = await PayingGuestBooking.findByIdAndUpdate(
        payingGuestId,
        update
      );

      return res.status(200).json({
        status: "success",
        data: UpdateServices,
      });
    }
    return next(
      new AppError("session id was wrong please contact to admin", 400)
    );
  } catch (error) {
    return next(new AppError("payment couldn't succeed contact to admin", 400));
  }
});
const getOne = catchAsync(async (req, res, next) => {
  const payingGuestBooking = await PayingGuestBooking.findById(req.params.id);

  if (!payingGuestBooking) {
    return next(new AppError("No document found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: payingGuestBooking,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const allPayingGuestBookings = await PayingGuestBooking.find(query);

  if (!allPayingGuestBookings.length) {
    return next(new AppError("No document found", 400));
  }

  res.status(200).json({
    status: "success",
    results: allPayingGuestBookings.length,
    data: allPayingGuestBookings,
  });
});
const updateOne = catchAsync(async (req, res, next) => {
  const payingGuestBooking = await PayingGuestBooking.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidator: true,
    }
  );

  if (req.body.status === "confirmed") {
    await PayingGuest.findByIdAndUpdate(payingGuestBooking.payingGuestId, {
      isRented: true,
    });
    const tenantEmail = await User.findById(
      payingGuestBooking.tenantId?.toString()
    ).select("email");
    const emailObj = {
      resetURL: "",
      email: tenantEmail,
      subject: `Property Booked confirm`,
      text: "Property confirmation Email",
      html: `<div style="padding:25px">
              <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
              <h2>Hi,</h2>
              <p>The Property that you booked has confirmed for serving.</p>
      </div>`,
    };
    await sendEmail(emailObj);
  }
  if (!payingGuestBooking) {
    return next(new AppError("No document found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: payingGuestBooking,
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  const payingGuestBooking = await PayingGuestBooking.findByIdAndDelete(
    req.params.id
  );

  if (!payingGuestBooking) {
    return next(new AppError("No document found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "Deleted successfully" },
  });
});
const getBookingsByLandOwner = catchAsync(async (req, res, next) => {
  const propertyBookings = await PayingGuestBooking.find({
    landownerId: req.user._id,
  })
    .populate({ path: "propertyId", select: "title images" })
    .populate({ path: "tenantId", select: "name image" });

  if (!propertyBookings.length) {
    return next(new AppError("No document found", 400));
  }
  return res.status(200).json({
    status: "success",
    data: propertyBookings,
  });
});

module.exports = {
  create,
  updateRecordInDB,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  getBookingsByLandOwner,
};
