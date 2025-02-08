const PropertyBooking = require("../models/propertyBooking");
const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const AppError = require("../middlewares/AppError");
require("dotenv").config();
const sendEmail = require("../helper/Email");
const { default: mongoose } = require("mongoose");
const stripe = require("stripe")(process.env.STRIP_SK);

const create = catchAsync(async (req, res, next) => {
  const bookProperty = await PropertyBooking.create(req.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: `${bookProperty.propertyId}`,
            description: "This is the payment amount for booked property",
          },
          unit_amount: req.body.totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      propertyId: JSON.stringify(bookProperty._id).split('"')[1],
    },
    mode: "payment",
    success_url:
      "http://localhost:5173/#/propertybooking/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:5173/",
  });

  const landownerId = await User.findById(req.body.landownerId).select("email");

  const emailObj = {
    resetURL: "",
    email: landownerId.email,
    subject: `Property Booking`,
    text: "Property Booking Email",
    html: `<div style="padding:25px">
             <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
             <h2>Hi,</h2>
             <p>Somebody booked Property. Please check your dashboard for confirmation.</p>
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

      propertyId = session.metadata.propertyId;

      const UpdateProperty = await PropertyBooking.findByIdAndUpdate(
        propertyId,
        update
      );

    return  res.status(200).json({
        status: "success",
        data: UpdateProperty,
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
  const bookProperty = await PropertyBooking.findById(req.params.id);

  if (!bookProperty) {
    return next(new AppError("No document found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: bookProperty,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const allPropertyBookings = await PropertyBooking.find(query);

  if (!allPropertyBookings.length) {
    return next(new AppError("No document found", 400));
  }

 return res.status(200).json({
    status: "success",
    results: allPropertyBookings.length,
    data: allPropertyBookings,
  });
});
const updateOne = catchAsync(async (req, res, next) => {
  const bookProperty = await PropertyBooking.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidator: true,
    }
  );

  if (!bookProperty) {
    return next(new AppError("No document found", 400));
  }

  if (req.body.status === "confirmed") {
    await PropertyBooking.findByIdAndUpdate(bookProperty.propertyId, {
      isRented: true,
    });
    const tenantEmail = await User.findById(
      PropertyBooking.tenantId?.toString()
    ).select("email");
    const emailObj = {
      resetURL: "",
      email: tenantEmail,
      subject: `Property Booked confirmation`,
      text: "Property confirmation Email",
      html: `<div style="padding:25px">
              <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
              <h2>Hi,</h2>
              <p>The Property that you booked has confirmed for serving.</p>
      </div>`,
    };
    await sendEmail(emailObj);
  }

  return res.status(200).json({
    status: "success",
    data: bookProperty,
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  const bookProperty = await PropertyBooking.findByIdAndDelete(req.params.id);

  if (!bookProperty) {
    return next(new AppError("No document found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "Deleted successfully" },
  });
});
const getBookingsByLandOwner = catchAsync(async (req, res, next) => {
  console.log(req.user);
  
  const propertyBookings = await PropertyBooking.find({ landownerId: req.user._id }).populate({ path: "propertyId", select: "title images" }).populate({ path: "tenantId", select: "name image" });
  if (!propertyBookings.length) {
    return next(new AppError("No document found", 400));
  }
  return res.status(200).json({
    status: "success",
    data:propertyBookings ,
  });
});

module.exports = {
  create,
  updateRecordInDB,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  getBookingsByLandOwner
};
