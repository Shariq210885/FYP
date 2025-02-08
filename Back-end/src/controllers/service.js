const Service = require("../models/service");
const catchAsync = require("../middlewares/catchAsync");
const AppError = require("../middlewares/AppError");
const { default: mongoose } = require("mongoose");

const create = catchAsync(async (req, res, next) => {
  req.body.providedById = req.user._id;

  const service = await Service.create(req.body);
  if (!service) {
    return next(new AppError("Couldn't create service try again", 400));
  }

 return res.status(200).json({
    status: "success",
    data: service,
  });
});
const getOne = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: service,
  });
});

const myService = catchAsync(async (req, res, next) => {

  const userId = new mongoose.Types.ObjectId(`${req.user._id}`)
  const myService = await Service.find({ providedById: userId })
  if (!myService.length) {
    return next(new AppError("No document found", 204));
  }
  return res.status(200).json({
    status: "success",
    results: myService.length,
    data: myService,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const services = await Service.find({});

  if (!services.length) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    results: services.length,
    data: services,
  });
});
const updateOne = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body);

  if (!service) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "document updated successfully" },
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "document deleted successfully" },
  });
});
const search = catchAsync(async (req, res, next) => {
  let query = { ...req.query };

  // If `title` is present in the query, apply a case-insensitive regex
  if (query.title) {
    query.title = { $regex: query.title, $options: "i" }; // 'i' makes the regex case-insensitive
  }

  const services = await Service.find(query);

  if (!services.length) {
    return next(new AppError("No document found", 204));
  }

  return res.status(200).json({
    status: "success",
    results: services.length,
    data: services,
  });
});
const postReview = catchAsync(async (req, res, next) => {
  const serviceId = req.params.id;

  const service = await Service.findByIdAndUpdate(
    serviceId,
    { $push: { reviews: req.body } }, // Only update the reviews field
    { new: true, runValidators: true } // Ensure validation is run and return the updated document
  );
  if(!service){
    return next(new AppError("Document not found", 400))
  }
  
  return res.status(200).json({
    status:"success",
    data: service
  })  
})

module.exports = {
  create,
  getOne,
  getAll,
  updateOne,
  deleteOne,
  search,
  myService,
  postReview
};
