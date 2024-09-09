import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "unnamed" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  profileImg: { type: String },
  bio: { type: String },
  blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }], // Corrected to "Blog"
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Corrected to "Comment"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.models?.User || mongoose.model("User", userSchema); // Corrected to "User"

export default UserModel;
