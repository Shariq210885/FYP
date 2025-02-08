const mongoose = require("mongoose");

const serviceBookingSchema = mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subServices: [
      {
        thumbnail: {
          type: String,
          default: "",
        },
        title: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: [true, "Scheduled date is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price must be positive"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      default: "pending",
    },
    paymentDetails: {
      paymentMethod: {
        type: String,
        enum: ["cash", "credit card", "bank transfer"],
        default: "cash",
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      transactionId: { type: String, default: "" },
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ServiceBooking = mongoose.model("ServiceBooking", serviceBookingSchema);

module.exports = ServiceBooking;