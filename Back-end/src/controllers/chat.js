const User = require("../models/user");
const Chat = require("../models/chat");
const catchAsync = require("../middlewares/catchAsync");
const AppError = require("../middlewares/AppError");
const { default: mongoose } = require("mongoose");

const create = catchAsync(async (req, res, next) => {
  // Step 1: Create the chat
  const chat = await Chat.create(req.body);

  // Step 2: Query the database to populate the fields
  const populatedChat = await Chat.findById(chat._id)
    .populate({ path: "senderId", select: "name image role" })
    .populate({ path: "receiverId", select: "name image role" });

  // Step 3: Check if the populated chat exists
  if (!populatedChat) {
    return next(new AppError("Couldn't post your query", 400));
  }

  // Step 4: Send the populated chat in the response
  return res.status(200).json({
    status: "success",
    data: populatedChat,
  });
});


const getOne = catchAsync(async (req, res, next) => {
const chat = await Chat.findById(req.params.id).populate({path:"senderId", select:"name image role"}).populate({path:"receiverId", select:"name image role"});;

  if (!chat) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: chat,
  });
});
const getAll = catchAsync(async (req, res, next) => {
  const chats = await Chat.find({}).populate({path:"senderId", select:"name image role"}).populate({path:"receiverId", select:"name image role"});

  if (!chats.length) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    result: chats.length,
    data: chats,
  });
});

const updateOne = catchAsync(async (req, res, next) => {
  const chat = await Chat.findByIdAndUpdate(req.params.id,req.body);

  if (!chat) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: chat,
  });
});
const deleteOne = catchAsync(async (req, res, next) => {
  const chat = await Chat.findByIdAndDelete(req.params.id);

  if (!chat) {
    return next(new AppError("Document not found", 400));
  }

  return res.status(200).json({
    status: "success",
    data: { message: "query deleted successfully" },
  });
});

const myChatwithOthers = catchAsync(async (req, res, next) => {
  if (!req.params.userid) {
    return next(new AppError("User ID is required", 400));
  }

  const chatWithId = new mongoose.Types.ObjectId(`${req.params.userid}`);

  const chats = await Chat.find({$or:[{
    senderId: req.user._id,
    receiverId: chatWithId,
  },{
    senderId: chatWithId,
    receiverId: req.user._id,
  }]}).populate({path:"senderId", select:"name image role"}).populate({path:"receiverId", select:"name image role"});

  if (!chats || chats.length === 0) {
    return next(new AppError("No chats found with the specified user", 204));
  }

  // Return chats
 return res.status(200).json({
    status: "success",
    result: chats.length,
    data: chats,
  });
});

module.exports = {
  create,
  getOne,
  getAll,
  myChatwithOthers,
  updateOne,
  deleteOne,
};
