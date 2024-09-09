import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CommentModel =
  mongoose.models.comment || mongoose.model("Comment", commentSchema);

export default CommentModel;
