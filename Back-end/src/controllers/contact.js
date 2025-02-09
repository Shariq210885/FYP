const catchAsync = require("../middlewares/catchAsync");
const Contact = require("../models/contact");
const AppError = require("../middlewares/AppError");
const { sendContactNotification } = require("../helper/notification");

const create = catchAsync(async (req, res, next) => {
  const contact = await Contact.create(req.body);

  if (!contact) {
    return next(new AppError("Couldn't post your query", 400));
  }

  // Send notification email
  await sendContactNotification(contact);

  return res.status(200).json({
    status: "success",
    data: contact,
  });
});
const getOne = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: contact,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({});

  if (!contacts.length) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    result: contacts.length,
    data: contacts,
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "query deleted successfully" },
  });
});

module.exports = {
  create,
  getOne,
  getAll,
  deleteOne,
};
