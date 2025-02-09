const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    providedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
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
    reviews: [
      {
        userid: {
          type: mongoose.Schema.Types.ObjectId,
        },
        userName: { type: String },
        userImage: { type: String, default: "" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
