const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plainPassword: { type: String },
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
  // createdAt: { type: Date, default: Date.now },

  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
// userSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("User", userSchema);
