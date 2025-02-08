const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    googleId: {
      type: String,
      default: "",
    },
    facebookId: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      minlength: 6,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    cnicImage: {
      type: Array,
      default: [],
    },
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "tenant",
      enum: ["tenant", "landowner", "serviceman","admin"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    favouriteProperties: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "properties",
      default: [],
    },
    favouriteservices: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "services",
      default: [],
    },
    address: {
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
      sector: {
        type: String,
        default: "",
      },
      street: {
        type: String,
        default: "",
      },
      houseNo: {
        type: String,
        default: "",
      },
    },
    passwordResetToken: {
      type: String,
      default: "",
    },
    passwordExpires: {
      type: Date,
      default: null,
    },
    emailVerificationToken: {
      type: String,
      default: "",
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isModified("isVerified") && this.isVerified) {
    this.verifiedAt = new Date();
  }
  next();
});

userSchema.methods.CorrectPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;