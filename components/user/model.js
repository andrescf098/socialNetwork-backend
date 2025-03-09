const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  nick: {
    type: String,
    required: true,
    unique: true,
  },
  biography: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryToken: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  image: {
    type: String,
    default: "userImage.png",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
UserSchema.plugin(mongoosePaginate);

module.exports = model("User", UserSchema);
