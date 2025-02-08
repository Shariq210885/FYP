const crypto = require("crypto");
const jwt = require("jsonwebtoken"); // FOR JSON WEBTOKEN
const AppError = require("./../middlewares/AppError");
const catchAsync = require("./../middlewares/catchAsync");
const User = require("../models/user");
const sendEmail = require("../helper/Email");

//GENERATE A RANDOM TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: Date.now() + 90 * 24 * 60 * 60 * 100,
  });
};

// CREATE TOKEN AND GENERATE RESPONSE FUNCTION
const createToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  user.password = undefined;
  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
// SIGNING UP
const signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.create(req.body);

  if (!user) {
    return next(new AppError("couldn't register", 400));
  }

  // Generate verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verificationURL = `http://localhost:5173/#/verify-email?token=${verificationToken}`;

  const emailObj = {
    email: user.email,
    subject: "Email Verification",
    text: "Verify your email",
    html: `<div style="padding:25px">
            <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
            <h2>Welcome ${user.name}!</h2>
            <p>Please verify your email address to complete your registration.</p>
            <p><a href="${verificationURL}" style="color: #ca3827">Click here</a> to verify your email. This link will expire in 24 hours.</p>
          </div>`,
  }

  try {
    await sendEmail(emailObj);
    user.password = undefined;
    res.status(201).json({
      status: "success",
      message: "Verification email sent",
      data: {
        user,
      },
    });
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the verification email. Please try again.",
        500
      )
    );
  }
});

const loginWithGoogle = catchAsync(async (req, res, next) => {
  createToken(req.user, 200, res);
});
// LOGING IN
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  let user = {};
  // check for email and password existance
  if (!email || !password)
    return next(new AppError("your email or password is wrong", 404));
  //  check for user existance
  if (email) {
    user = await User.findOne({ email }).select("+password");
  }

  if (!user){
    return next(
      new AppError(
        "This account does not exist!",
        404
      )
    );
  }

  if (email && !user.password) {
    return next(
      new AppError(
        "This account does not exists or is linked to a google account",
        404
      )
    );
  }
  if (!user) return next(new AppError("This account does not exists", 404));

  if (!user || !(await user.CorrectPassword(password, user.password))) {
    return next(new AppError("your password is Incorrect", 404));
  }
  if (!user.isVerified) {
    return next(new AppError("Please verify your email to login", 401));
  }

  createToken(user, 200, res);
});

const logout = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    token: "",
    message: "you are logged Out",
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError("No user exist with this email address", 404));
  }
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  const resetURL = `http://localhost:5173/#/reset-password?token=${resetToken}`;

  const emailObj = {
    resetURL: resetURL,
    email: req.body.email,
    subject: "Forgot Password Email",
    text: "Forgot password email",
    html: `<div style="padding:25px">
            <h1 class="title" style="color:#ca3827;">E-Makaan</h1>
            <h2>Hi,</h2>
            <p>If you didn't forget your password ignore this Email</p>
            <p><a href="${resetURL}" style="color: #ca3827">click here</a>  to Reset your password. Email will be expire in 10 minutes </p>
    </div>`,
  };
  try {
    await sendEmail(emailObj);
    res.status(201).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    next(new AppError("there was an error sending the email, try later", 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.query.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 404));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordExpires = undefined;
  await user.save();

  createToken(user, 200, res);
});

//FOR UPDATE LOGGED IN USER PASSWORD
const updatePassword = catchAsync(async (req, res, next) => {
  // Get a user from the collection that you want to update its password

  const user = await User.findById(req.user._id).select("+password");

  // Check if the current password correct or not
  if (!user.CorrectPassword(req.body.currentPassword, user.password)) {
    next(new AppError("your current password is wrong!", 404));
  }
  // if so, updaate current user password
  user.password = req.body.newpassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //send user data along with new token
  return createToken(user, 201, res);
});

const updateProfile = catchAsync(async (req, res, next) => {
  console.log("Heelo")
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      runValidator: true,
      new: true,
    });
    console.log(req.body);
  
    if (!updatedUser) {
      return next(new AppError("document not found", 404));
    }
  
    res.status(200).json({
      status: "success",
      message: "Your profile completed. Now wait for verification",
      data: {
        updatedUser,
      },
    });
  } catch (error) {
    console.log(error)
  }
});

const verifyAccount = catchAsync(async (req, res, next) => {
  const verifiedUser = await User.findByIdAndUpdate(req.params.id, {
    isVerified: true,
    verifiedAt: Date.now(),
  });
  if (!verifiedUser) {
    return next(new AppError("document not found", 404));
  }
  return res.status(200).json({
    status: "success",
    message: "user profile verified",
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.query.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  user.verifiedAt = Date.now();
  await user.save();

  createToken(user, 200, res);
});

const verifyUserAccount = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.query.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  user.verifiedAt = Date.now();
  await user.save();

  createToken(user, 200, res);
});

const userProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("document not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const deleteAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) {
    return next(new AppError("document not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "account deleted",
  });
});

const allUsers = catchAsync(async (req, res, next) => {
  const allowedFilters = ["name", "email", "role"]; // Allowed fields
  const filter = Object.keys(req.query)
    .filter((key) => allowedFilters.includes(key))
    .reduce((acc, key) => {
      acc[key] = req.query[key];
      return acc;
    }, {});

  const users = await User.find(filter);

  if (!users.length) {
    return next(new AppError("No document found", 204));
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

module.exports = {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  userProfile,
  deleteAccount,
  updateProfile,
  verifyAccount,
  allUsers,
  loginWithGoogle,
  verifyEmail,
  verifyUserAccount, // Add this to exports
};

