import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blogSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    views: {
      type: Number,
      default: 0,
    },
    viewedBy: [
      {
        ipAddress: String,
        lastViewed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

blogSchema.plugin(mongoosePaginate);

const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default BlogModel;
