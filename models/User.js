import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    isAdmin: { type: Boolean, default: false },
    smoking: { type: String, default: "No" },
    pets: { type: String, default: "No" },
    cleanliness: { type: String, default: "Moderate" },
    workFromHome: { type: String, default: "No" },
    budget: { type: String },
    roommateGender: { type: String, default: "Any" },
    roommatesCount: { type: Number, default: 1 },
    profileImage: { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
