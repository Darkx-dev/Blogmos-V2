import ConnectDB from "@/lib/config/db";
import { NextResponse } from "next/server";
import BlogModel from "@/lib/models/BlogModel";
import UserModel from "@/lib/models/UserModel";
import mongoose from "mongoose";
import sharp from "sharp";
import { headers } from "next/headers";
import { differenceInHours } from "date-fns";
import { auth } from "@/auth";

async function connectDatabase() {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
}
// API endpoint to get all blog posts with pagination
export async function GET(req) {
  try {
    await connectDatabase(); // Ensure DB connection

    const blogId = req.nextUrl.searchParams.get("id");
    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10;
    const query = req.nextUrl.searchParams.get("query");
    const category = req.nextUrl.searchParams.get("category");

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

    let filter = {};
    /* 
    {
      title: Regex_expresion,
      category: else_than _ALL,
      
    } 
    */

    if (query) {
      const searchRegex = new RegExp(query, "i");
      filter.title = searchRegex;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (blogId) {
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return NextResponse.json(
          { message: "Invalid blog ID format" },
          { status: 400 }
        );
      }
      const xForwaded = headers().get("x-forwarded-for");
      const clientIp = xForwaded !== "::1" ? xForwaded : "127.0.0.1";
      const blog = await BlogModel.findById(blogId).populate(
        "author",
        "name profileImg"
      );

      const existingView = blog.viewedBy.find(
        (view) => view?.ipAddress === clientIp
      );
      const hoursSinceLastView = existingView
        ? differenceInHours(new Date(), new Date(existingView.lastViewed))
        : 25; // Default to 25 hours if not found to ensure a new view is counted

      if (!existingView && hoursSinceLastView > 24) {
        await BlogModel.findByIdAndUpdate(
          blogId,
          {
            $inc: { views: 1 }, // Increment views by 1
            $push: {
              viewedBy: {
                ipAddress: clientIp,
                lastViewed: new Date(),
              },
            },
          },
          { new: true } // Return the updated document
        );
      }
      if (!blog) {
        return NextResponse.json(
          { message: "Blog not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ blog });
    }

    const result = await BlogModel.paginate(filter, options);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET req:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
// API endpoint to upload blog posts
export async function POST(req) {
  // Check authentication
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDatabase(); // Ensure DB connection

    const formData = await req.formData();

    const image = formData.get("image");
    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    let imageUri = "";
    // Read the image file
    if (image instanceof File) {
      // Read and process the new image if it's not base64
      const imageBuffer = await image.arrayBuffer();
      const compressedImageBuffer = await sharp(Buffer.from(imageBuffer))
        .resize(800)
        .webp({ quality: 60 })
        .toBuffer();

      const base64Image = compressedImageBuffer.toString("base64");
      imageUri = `data:image/webp;base64,${base64Image}`; // Update image URI
    } else {
      // If the image is already base64, use it directly
      imageUri = image;
    }

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      image: imageUri,
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
    console.error("Error in POST req:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
// API endpoint to update a blog post
export async function PUT(req) {
  // Check authentication
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDatabase(); // Ensure DB connection

    const blogId = req.nextUrl.searchParams.get("id");
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: "Invalid blog ID format" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    let imageUri = blog.image; // Use the existing image if no new one is uploaded

    const image = formData.get("image");

    if (image) {
      if (image instanceof File) {
        // Read and process the new image if it's a File
        const imageBuffer = await image.arrayBuffer();
        const compressedImageBuffer = await sharp(Buffer.from(imageBuffer))
          .resize(800)
          .webp({ quality: 60 })
          .toBuffer();

        const base64Image = compressedImageBuffer.toString("base64");
        imageUri = `data:image/webp;base64,${base64Image}`; // Update image URI
      } else if (typeof image === "string" && image.startsWith("data:")) {
        // If the image is a base64 string, use it directly
        imageUri = image;
      } else {
        return NextResponse.json(
          { message: "Invalid image format" },
          { status: 400 }
        );
      }
    }

    // Update blog data with new or existing fields
    const updatedBlogData = {
      title: formData.get("title") || blog.title,
      description: formData.get("description") || blog.description,
      category: formData.get("category") || blog.category,
      content: formData.get("content") || blog.content,
      image: imageUri,
    };

    // Update the blog post
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      updatedBlogData,
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Blog updated successfully",
        blog: updatedBlog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT req:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
// API endpoint to delete a blog post
export async function DELETE(req) {
  // Check authentication
  const session = await auth()
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDatabase(); // Ensure DB connection

    const blogId = req.nextUrl.searchParams.get("id");
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
    console.error("Error in DELETE req:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
