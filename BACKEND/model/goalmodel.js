const mongoose = require("mongoose");

const textschema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usersdata",
      required: true
    },
    Texts: {
      type: String,
      required: [true, "Please add a text input"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Texts", textschema, "Texts");
