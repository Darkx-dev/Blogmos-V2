import ConnectDB from "@/lib/config/db";
import { NextResponse } from "next/server";
import BlogModel from "@/lib/models/BlogModel";
import UserModel from "@/lib/models/UserModel";
import mongoose from "mongoose";
import sharp from "sharp";
import path from "path";

async function connectDatabase() {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
}

// API endpoint to get all blog posts with pagination
export async function GET(request) {
  try {
    await connectDatabase(); // Ensure DB connection

    const blogId = request.nextUrl.searchParams.get("id");
    const page = parseInt(request.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(request.nextUrl.searchParams.get("limit")) || 10;
    const query = request.nextUrl.searchParams.get("query");

    const options = {
      page,
      limit,
      sort: {
        createdAt: -1,
      },
      populate: {
        path: "author",
        select: "name profileImg",
      },
    };

    if (query) {
      const searchRegex = new RegExp(query, "i");
      const result = await BlogModel.paginate({ title: searchRegex }, options);
      return NextResponse.json(result);
    }

    if (blogId) {
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return NextResponse.json(
          { message: "Invalid blog ID format" },
          { status: 400 }
        );
      }

      const blog = await BlogModel.findById(blogId).populate("author", "name profileImg")
      if (!blog) {
        return NextResponse.json(
          { message: "Blog not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ blog });
    }

    const result = await BlogModel.paginate({}, options);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// API endpoint to upload blog posts
export async function POST(request) {
  try {
    await connectDatabase(); // Ensure DB connection

    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get("image");
    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // Read the image file
    const imageBuffer = await image.arrayBuffer();

    // Compress and resize the image
    const compressedImageBuffer = await sharp(Buffer.from(imageBuffer))
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();

    // Generate a unique filename
    const filename = `${timestamp}_${path.parse(image.name).name}.webp`;
    const base64Image = compressedImageBuffer.toString("base64");
    const base64ImageUri = `data:image/webp;base64,${base64Image}`;

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      image: base64ImageUri,
      category: formData.get("category"),
      author: formData.get("author"),
      authorImg: formData.get("authorImg"),
      content: formData.get("content"),
    };

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "category",
      "author",
      "content",
    ];
    for (const field of requiredFields) {
      if (!blogData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const newBlog = await BlogModel.create(blogData);

    const user = await UserModel.findById(blogData.author);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.blogPosts.push(newBlog._id);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// API endpoint to delete a blog post
export async function DELETE(request) {
  try {
    await connectDatabase(); // Ensure DB connection

    const blogId = request.nextUrl.searchParams.get("id");
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const deletedPost = await BlogModel.findByIdAndDelete(blogId);
    if (!deletedPost) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    await UserModel.updateOne(
      { _id: deletedPost.author },
      { $pull: { blogPosts: blogId } }
    );

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully", blogId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
