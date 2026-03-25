const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please add a name"]
    },
    email: {
        type: String,
        required: [true,"Please add a email"],
        unique: true
    },
    password: {
        type: String,
        required: [true,"Please add a password"]
    },
    refreshToken: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Usersdata", userSchema)