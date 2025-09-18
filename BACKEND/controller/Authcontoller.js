const asyncHandler = require("express-async-handler");
const Texts = require("../model/goalmodel");
const User = require("../model/usermodel");
// 
const gettexts = asyncHandler(async (req, res) => {
  const texts = await Texts.find({ user: req.user.id });

  return res.status(200).json(texts);
});

const postexts = asyncHandler(async (req, res) => {
  console.log(req.body);
  const item_data = await Texts.create({
    Texts: req.body.Texts,
    user: req.user.id,
  });
  return res.status(200).json(item_data);
});
const puttexts = asyncHandler(async (req, res) => {
  const texts_item = await Texts.findById(req.params.id);

  if (!texts_item) {
    res.status(400);
    throw new Error("Can't update");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (texts_item.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const updated_textitem = await Texts.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      news: true,
    }
  );
  return res.status(200).json(updated_textitem);
});
const deletetexts = asyncHandler(async (req, res) => {
  const texts_item_1 = await Texts.findById(req.params.id);
  if (!texts_item_1) {
    res.status(400);
    throw new Error("Cantt Delete");
  }
  console.log(texts_item_1);

  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (texts_item_1.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await texts_item_1.deleteOne();
  //   await Texts.findByIdAndRemove(req.params.id);
  return res.send("deleted");
});
module.exports = {
  gettexts,
  postexts,
  puttexts,
  deletetexts,
};
