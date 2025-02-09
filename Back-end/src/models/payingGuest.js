const mongoose = require("mongoose");

const payingGuestSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    propertyType: {
      type: String,
      required: [true, "propertyType is required"],
    },
    postedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    contractPaper: {
      type: String,
      default: "",
    },
    isRented: {
      type: Boolean,
      default: false,
    },
    area: {
      type: Number,
      required: [true, "area is required"],
    },
    areaMeasureType: {
      type: String,
      required: [true, "areaMeasureType is required"],
    },
    rentPrice: {
      type: Number,
      required: [true, "rentPrice is required"],
      min: [0, "Rent price must be positive"],
    },
    bedRooms: {
      type: Number,
      required: [true, "number of bedRooms is required"],
      min: [0, "Number of bedrooms must be positive"],
    },
    securityAmount: {
      type: Number,
      required: [true, "rentPrice is required"],
      min: [0, "Rent price must be positive"],
    },
    bathRooms: {
      type: Number,
      required: [true, "number of bathRooms is required"],
      min: [0, "Number of bathrooms must be positive"],
    },

    floorNumber: {
      type: String,
      required: [true, "floorNumber is required"],
    },
    description: {
      type: String,
      default: "",
    },
    policies: [String],

    country: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    street: {
      type: String,
      default: "",
    },
    sector: {
      type: String,
      default: "",
    },
    houseNo: {
      type: String,
      default: "",
    },
    facilities: [String],
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
    rentedHistory: [
      {
        userName: { type: String },
        userImage: { type: String },
        fromDate: { type: Date },
        toDate: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const PayingGuest = mongoose.model("PayingGuest", payingGuestSchema);

module.exports = PayingGuest;
