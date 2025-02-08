const jwt = require("jsonwebtoken"); // FOR JSON WEBTOKEN
const AppError = require("./../middlewares/AppError");
const catchAsync = require("./../middlewares/catchAsync");
const User = require("../models/user");

// PROTECT ROUTS
const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new AppError("You are not logged in!", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new AppError("Token is not valid!", 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("Sorry Your account is no more!", 401));
    }
    req.user = user;
    next();
  });
});

const restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.role)) {
      next(
        new AppError("you don't have permission to perform this action", 403)
      );
    }
    next();
  };
};
const authenticateWithGoogleId = async (req, res, next) => {
  try {
    const { googleId, name, email, image } = req.body;

    if (!googleId || !name || !email) {
      return res.status(httpSts.BAD_REQUEST).json({
        status: "fail",
        message: "Google ID, Name, and Email are required",
      });
    }

    let user = await User.findOne({ googleId });

    if (user) {
      // Update image if it has changed
      if (image && user.image !== image) {
        user.image = image;
        user = await user.save();
      }
      req.user = user;
      return next();
    } else {
      user = await User.findOne({ email }).setOptions({
        includeGoogleId: true,
      });

      if (!user) {
        // Create a new user with image
        user = await User.create({ googleId, name, email, image });
        req.user = user;
        return next();
      } else {
        user.googleId = googleId;
        if (image) {
          user.image = image;
        }
        user = await user.save();
        req.user = user;
        return next();
      }
    }
  } catch (err) {
    return next(new AppError("something went very wrong", 400));
  }
};

module.exports = {
  protect,
  authenticateWithGoogleId,
  restrictTo,
};