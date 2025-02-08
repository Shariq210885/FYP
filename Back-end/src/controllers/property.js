const catchAsync = require("../middlewares/catchAsync");
const Property = require("../models/property");
const AppError = require("../middlewares/AppError");
const { default: mongoose } = require("mongoose");

const create = catchAsync(async (req, res, next) => {
  console.log("Here")
  console.log(req.body)
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
      console.log("Here22")
      return next(new AppError("property couldn't listed try again", 400));
    }
  
    res.status(201).json({
      status: "success",
      data: property,
    });
  } catch (error) { 
    console.log(error)
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
  } catch (error) {
  }
});

const search = catchAsync(async (req, res, next) => {
  const { areaMin, areaMax, priceMin, priceMax, ...rest } = req.query;

  // Parse rest parameters, e.g., bedRooms
  if (rest.bedRooms) {
    rest.bedRooms = JSON.parse(rest.bedRooms);
  }

  const query = {};

  // Add area condition
  if ((areaMin && areaMin != "null") || (areaMax && areaMax != "null")) {
    query.area = {};
    if (areaMin) query.area.$gte = Number(areaMin);
    if (areaMax) query.area.$lte = Number(areaMax);
  }

  // Add price condition
  if ((priceMin && priceMin != "null") || (priceMax && priceMax != "null")) {
    query.rentPrice = {};
    if (priceMin) query.rentPrice.$gte = Number(priceMin);
    if (priceMax) query.rentPrice.$lte = Number(priceMax);
  }

  // Add rest parameters (case-insensitive matching for specific fields)
  Object.keys(rest).forEach((key) => {
    const value = rest[key];
    if (value) {
      if (["city", "sector", "propertyType"].includes(key)) {
        query[key] = { $regex: new RegExp(value, "i") }; // Case-insensitive regex
      } else {
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

  const propertyId = req.params.propertyid;

  // Only push new review to the reviews array
  const property = await Property.findByIdAndUpdate(
    propertyId,
    { $push: { reviews: req.body } }, // Only update the reviews field
    { new: true, runValidators: true } // Ensure validation is run and return the updated document
  );

  if (!property) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: property
  });
});

module.exports = {
  create,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  myProperties,
  search,
  postReview
};
