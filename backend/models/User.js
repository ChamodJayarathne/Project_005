const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
       
        return /\d{10,15}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
  
  role: { type: String, enum: ["admin", "user"], required: true },
  profileImage: { type: String }, // Add this field
});

module.exports = mongoose.model("User", userSchema);
