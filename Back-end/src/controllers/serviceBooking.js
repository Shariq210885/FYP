const ServiceBooking = require("../models/serviceBooking");
const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const AppError = require("../middlewares/AppError");
const sendEmail = require("../helper/Email");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIP_SK);

const create = catchAsync(async (req, res, next) => {
  const serviceBookings = await ServiceBooking.insertMany(req.body.services);

  if (!serviceBookings.length) {
    return next(new AppError("Couldn't book services", 400));
  }

  let serviceTitle = "";
  const servicesIDs = serviceBookings.map((service) => {
    serviceTitle += `${service.title}, `;
    return service._id.toString();
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: serviceTitle.trimEnd(", "), // Trim trailing comma
            description: "This is the payment amount for all booked services",
          },
          unit_amount: req.body.totalAmount * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      serviceIDs: JSON.stringify(servicesIDs),
    },
    mode: "payment",
    success_url:
      "https://fyp-3kn1.onrender.com/#/servicebooking/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://fyp-3kn1.onrender.com/#/",
  });

  const provider = await User.findById(req.body.services[0].providerId).select(
    "email"
  );
  if (!provider) {
    return next(new AppError("Provider not found", 404));
  }

  const emailObj = {
    resetURL: "",
    email: provider.email, // Access the email directly
    subject: `${req.body.services.length} Services Booked`,
    text: "Service Booking Email",
    html: `<div style="padding:25px">
             <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
             <h2>Hi,</h2>
             <p>Somebody booked ${req.body.services.length} services. Please check your dashboard for confirmation.</p>
           </div>`,
  };

  await sendEmail(emailObj);

  // Ensure no further processing occurs after this
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

      bookedServiceIds = JSON.parse(session.metadata.serviceIDs);

      const UpdateServices = await Promise.all(
        bookedServiceIds.map(async (serviceId) => {
          return await ServiceBooking.findByIdAndUpdate(serviceId, update);
        })
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
  const serviceBooking = await ServiceBooking.findById(req.params.id).populate({
    path: "serviceId",
    select: "title thumbnail",
  });

  if (!serviceBooking) {
    return next(new AppError("Document not found", 400));
  }

  res.status(200).json({
    status: "success",
    data: serviceBooking,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const serviceBookings = await ServiceBooking.find({}).populate({
    path: "serviceId",
    select: "title thumbnail",
  });

  if (!serviceBookings.length) {
    return next(new AppError("Document not found", 400));
  }

  res.status(200).json({
    status: "success",
    result: serviceBookings.length,
    data: serviceBookings,
  });
});
const updateOne = catchAsync(async (req, res, next) => {
  // let { serviceManId, status } = req.body;
  // serviceManId = new mongoose.Types.ObjectId(`${serviceManId}`);
  const serviceBooking = await ServiceBooking.findByIdAndUpdate(
    req.params.id,
    // {serviceManId:serviceManId,status:status}
    req.body
  );

  if (!serviceBooking) {
    return next(new AppError("Document not found", 400));
  }

  if (req.body.status === "confirmed") {
    const tenantEmail = await User.findById(
      serviceBooking.tenantId?.toString()
    ).select("email");
    const emailObj = {
      resetURL: "",
      email: tenantEmail,
      subject: `Services Booked`,
      text: "Service confirmation Email",
      html: `<div style="padding:25px">
              <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
              <h2>Hi,</h2>
              <p>The service that you booked has confirmed for serving.</p>
      </div>`,
    };
    await sendEmail(emailObj);
  }

  return res.status(200).json({
    status: "success",
    data: { message: "Service assigned successfully" },
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  const serviceBooking = await ServiceBooking.findByIdAndDelete(req.params.id);
  if (!serviceBooking) {
    return next(new AppError("Document not found", 400));
  }

  res.status(200).json({
    status: "success",
    data: { message: "Document deleted successfully" },
  });
});
const myAssignedServiceBookings = catchAsync(async (req, res, next) => {
  const serviceBookings = await ServiceBooking.find({
    serviceManId: req.user._id,
  }).populate({ path: "serviceId", select: "title thumbnail" });

  if (!serviceBookings.length) {
    return res.status(204).json({
      message: "No content available.",
    });
  }

  res.status(200).json({
    status: "success",
    data: serviceBookings,
  });
});

module.exports = {
  create,
  updateRecordInDB,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  myAssignedServiceBookings,
};
