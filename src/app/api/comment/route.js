import ConnectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import CommentModel from "@/lib/models/CommentModel";
import { NextResponse } from "next/server";

async function connectDatabase() {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
}

const POST = async (req, res) => {
  try {
    await connectDatabase(); // Ensure DB connection

    const { content, blogId } = await req.json();
    const comment = await CommentModel.create({
      content,
      blog: blogId,
    });
    await BlogModel.findByIdAndUpdate(blogId, {
      $push: { comments: comment._id },
    });
    return NextResponse.json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: err.status }
    );
  }
};

export { POST };
