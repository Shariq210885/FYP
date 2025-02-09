const catchAsync = require("../middlewares/catchAsync");
const Property = require("../models/property");
const AppError = require("../middlewares/AppError");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");

const create = catchAsync(async (req, res, next) => {
  console.log("Here");
  console.log(req.body);
  try {
    if (req.body.policies) {
      req.body.policies = JSON.parse(req.body.policies);
    }

    if (req.body.facilities) {
      req.body.facilities = JSON.parse(req.body.facilities);
    }

    req.body.postedById = req.user._id;
    const property = await Property.create(req.body);

    if (!property) {
      console.log("Here22");
      return next(new AppError("property couldn't listed try again", 400));
    }

    res.status(201).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    console.log(error);
  }
});
const getOne = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: property,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const properties = await Property.find({});

  if (!properties.length) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});
const updateOne = catchAsync(async (req, res, next) => {
  if (req.body.policies) {
    req.body.policies = JSON.parse(req.body.policies);
  }

  if (req.body.facilities) {
    req.body.facilities = JSON.parse(req.body.facilities);
  }
  const property = await Property.findByIdAndUpdate(req.params.id, req.body);

  if (!property) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "document updated successfully" },
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  const property = await Property.findByIdAndDelete(req.params.id);

  if (!property) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "document deleted successfully" },
  });
});
const myProperties = catchAsync(async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(`${req.user._id}`);
    const myProperty = await Property.find({ postedById: userId });
    if (!myProperty.length) {
      return next(new AppError("No document found", 204));
    }
    return res.status(200).json({
      status: "success",
      results: myProperty.length,
      data: myProperty,
    });
  } catch (error) {}
});

const search = catchAsync(async (req, res, next) => {
  let { areaMin, areaMax, priceMin, priceMax, ...rest } = req.query;

  // Handle "Any" or invalid values
  areaMin = areaMin === "Any" || areaMin === "null" ? 0 : Number(areaMin);
  areaMax =
    areaMax === "Any" || areaMax === "null"
      ? Number.MAX_SAFE_INTEGER
      : Number(areaMax);
  priceMin = priceMin === "Any" || priceMin === "null" ? 0 : Number(priceMin);
  priceMax =
    priceMax === "Any" || priceMax === "null"
      ? Number.MAX_SAFE_INTEGER
      : Number(priceMax);

  // Parse rest parameters
  if (rest.bedRooms) {
    rest.bedRooms = JSON.parse(rest.bedRooms);
  }

  const query = {
    area: { $gte: areaMin, $lte: areaMax },
    rentPrice: { $gte: priceMin, $lte: priceMax },
  };

  // Add rest parameters (case-insensitive matching for specific fields)
  Object.keys(rest).forEach((key) => {
    const value = rest[key];
    if (value && value !== "null" && value !== "") {
      if (["city", "sector", "propertyType"].includes(key)) {
        query[key] = { $regex: new RegExp(value, "i") };
      } else if (value !== "0") {
        // Only add if not zero
        query[key] = value;
      }
    }
  });

  // Fetch properties
  const properties = await Property.find(query);

  if (!properties.length) {
    return next(new AppError("No document found", 204));
  }

  res.status(200).json({
    status: "success",
    result: properties.length,
    data: properties,
  });
});
const postReview = catchAsync(async (req, res, next) => {
  try {
    const propertyId = req.params.propertyid;
    const reviewUser = req.body.userid;

    if (!propertyId || !reviewUser) {
      return next(new AppError("Missing required fields", 400));
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return next(new AppError("Property not found", 404));
    }

    // Convert ObjectIds to strings for comparison
    const propertyOwnerId = property.postedById.toString();
    const reviewUserId = reviewUser.toString();

    // Check if user is trying to review their own property
    if (propertyOwnerId === reviewUserId) {
      return next(new AppError("You can't review your own property", 400));
    }

    // Check if user has already reviewed this property
    const hasReviewed = property.reviews.some(review => {
      // Handle both cases where review.userid might be a string or ObjectId
      const reviewerId = review.userid ? review.userid.toString() : null;
      return reviewerId === reviewUserId;
    });

    if (hasReviewed) {
      return next(new AppError("You have already reviewed this property", 400));
    }

    // Validate review data
    const reviewData = {
      userid: reviewUser,
      userName: req.body.userName,
      userImage: req.body.userImage || "",
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    // Validate rating
    if (isNaN(reviewData.rating) || reviewData.rating < 1 || reviewData.rating > 5) {
      return next(new AppError("Rating must be between 1 and 5", 400));
    }

    // Add the new review
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $push: { reviews: reviewData } },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return next(new AppError("Failed to update property with review", 400));
    }

    return res.status(200).json({
      status: "success",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Review Error:", error);
    return next(new AppError(error.message || "Error posting review", 500));
  }
});

module.exports = {
  create,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  myProperties,
  search,
  postReview,
};
