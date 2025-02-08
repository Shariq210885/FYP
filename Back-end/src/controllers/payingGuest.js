const catchAsync = require("../middlewares/catchAsync");
const PayingGuest = require("../models/payingGuest");
const AppError = require("../middlewares/AppError");
const { default: mongoose } = require("mongoose");

const create = catchAsync(async (req, res, next) => {
  if (req.body.policies) {
    req.body.policies = JSON.parse(req.body.policies);
  }

  if (req.body.facilities) {
    req.body.facilities = JSON.parse(req.body.facilities);
  }

  req.body.postedById = req.user._id;
  const payingGuest = await PayingGuest.create(req.body);

  if (!payingGuest) {
    return next(new AppError("payingGuest couldn't listed try again", 400));
  }

  res.status(201).json({
    status: "success",
    data: payingGuest,
  });
});
const getOne = catchAsync(async (req, res, next) => {
  const payingGuest = await PayingGuest.findById(req.params.id);

  if (!payingGuest) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: payingGuest,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const payingGuests = await PayingGuest.find({});

  if (!payingGuests.length) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    results: payingGuests.length,
    data: payingGuests,
  });
});
const updateOne = catchAsync(async (req, res, next) => {
  if (req.body.policies) {
    req.body.policies = JSON.parse(req.body.policies);
  }
  if (req.body.facilities) {
    req.body.facilities = JSON.parse(req.body.facilities);
  }
  const payingGuest = await PayingGuest.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!payingGuest) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "document updated successfully" },
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  
  const payingGuest = await PayingGuest.findByIdAndDelete(req.params.id);

  if (!payingGuest) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "document deleted successfully" },
  });
});

const myPayingGuests = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(`${req.user._id}`);
  const myPayingGuests = await PayingGuest.find({ postedById: userId });
  if (!myPayingGuests.length) {
    return next(new AppError("No document found", 204));
  }
  return res.status(200).json({
    status: "success",
    results: myPayingGuests.length,
    data: myPayingGuests,
  });
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

  const properties = await PayingGuest.find(query);

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
  const payingguestId = req.params.id;

  const payingguest = await PayingGuest.findByIdAndUpdate(
    payingguestId,
    { $push: { reviews: req.body } }, // Only update the reviews field
    { new: true, runValidators: true } // Ensure validation is run and return the updated document
  );
  if(!payingguest){
    return next(new AppError("Document not found", 400))
  }
    
  return res.status(200).json({
    status:"success",
    data:payingguest
  })  
})
module.exports = {
  create,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  myPayingGuests,
  search,
  postReview
};
