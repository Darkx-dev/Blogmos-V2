import ConnectDB from "@/lib/config/db";
import { NextResponse } from "next/server";
import BlogModel from "@/lib/models/BlogModel";
import mongoose from "mongoose";
import sharp from "sharp";
import path from "path";
import UserModel from "@/lib/models/UserModel";

const LoadDB = async () => {
  try {
    await ConnectDB();
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

LoadDB();

// API endpoint to get all blog posts
async function GET(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
      // Check if the blogId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return NextResponse.json(
          { message: "Invalid blog ID format" },
          { status: 404 }
        );
      }

      const blog = await BlogModel.findById(blogId).populate(
        "author",
        "name profileImg"
      );
      if (!blog) {
        return NextResponse.json(
          { message: "Blog not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ blog });
    }
    const blogs = await BlogModel.find({}).populate(
      "author",
      "name profileImg"
    );
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error in GET request:", error);
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// API endpoint to upload blog posts
export async function POST(request) {
  try {
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
      .resize(800) // Resize to max width of 800px
      .webp({ quality: 80 }) // Convert to WebP format with 80% quality
      .toBuffer();
    // Generate a unique filename
    const filename = `${timestamp}_${path.parse(image.name).name}.webp`;
    // Convert the compressed image to a Base64 string
    const base64Image = compressedImageBuffer.toString("base64");
    // Construct the Base64 data URI format
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
    // Find the user by the author ID and push the new blog ID into the `blogs` array
    const user = await UserModel.findById(blogData.author);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // Push the new blog ID into the user's blogs array
    user.blogPosts.push(newBlog._id);
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog: newBlog,
      },
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

// API endpoint to Delete blog post
export async function DELETE(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  const deletedPost = await BlogModel.findByIdAndDelete(blogId);
  if (!deletedPost) {
    return NextResponse.json({ message: "Blog not found" }, { status: 404 });
  }
  return NextResponse.json(
    {
      success: true,
      message: "Blog deleted successfully",
      blogId: blogId,
    },
    { status: 200 }
  );
}

export { GET };

export const runtime = "nodejs";
